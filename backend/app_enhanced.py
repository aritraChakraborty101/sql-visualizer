from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import sqlglot
from sqlglot import exp
from typing import List, Dict, Any, Optional

app = Flask(__name__)
CORS(app)

DATABASE = 'employees.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def execute_query_safe(query: str) -> tuple:
    """Execute query and return columns and rows"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query)
    columns = [description[0] for description in cursor.description]
    rows = cursor.fetchall()
    conn.close()
    
    formatted_rows = []
    for row in rows:
        formatted_rows.append(list(row))
    
    return columns, formatted_rows

def get_table_data(table_name: str) -> tuple:
    """Fetch all data from a table"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    columns = [description[0] for description in cursor.description]
    rows = cursor.fetchall()
    conn.close()
    
    data = []
    for row in rows:
        data.append(dict(zip(columns, row)))
    
    return columns, data

def extract_table_names(node) -> List[str]:
    """Extract table names from AST"""
    tables = []
    for table in node.find_all(exp.Table):
        tables.append(table.name)
    return tables

def extract_join_info(ast) -> List[Dict]:
    """Extract JOIN information from AST"""
    joins = []
    for join in ast.find_all(exp.Join):
        join_type = join.args.get('kind', 'INNER')
        on_condition = join.args.get('on')
        join_table = None
        
        # Get the table being joined
        if 'this' in join.args:
            join_table = join.args['this']
            if isinstance(join_table, exp.Table):
                join_table = join_table.name
        
        joins.append({
            'type': join_type,
            'table': str(join_table) if join_table else 'unknown',
            'on': str(on_condition) if on_condition else None
        })
    return joins

def extract_where_clause(ast) -> Optional[str]:
    """Extract WHERE clause from AST"""
    for where in ast.find_all(exp.Where):
        return str(where.this)
    return None

def extract_group_by(ast) -> List[str]:
    """Extract GROUP BY columns from AST"""
    group_by = []
    for group in ast.find_all(exp.Group):
        for expr in group.expressions:
            group_by.append(str(expr))
    return group_by

def extract_having_clause(ast) -> Optional[str]:
    """Extract HAVING clause from AST"""
    for having in ast.find_all(exp.Having):
        return str(having.this)
    return None

def extract_order_by(ast) -> List[Dict]:
    """Extract ORDER BY information from AST"""
    order_by = []
    for order in ast.find_all(exp.Order):
        for expr in order.expressions:
            column = str(expr.this)
            direction = 'ASC'
            if isinstance(expr, exp.Ordered):
                direction = 'DESC' if expr.args.get('desc') else 'ASC'
            order_by.append({'column': column, 'direction': direction})
    return order_by

def extract_select_columns(ast) -> List[str]:
    """Extract SELECT columns from AST"""
    columns = []
    for select in ast.find_all(exp.Select):
        for expr in select.expressions:
            if isinstance(expr, exp.Alias):
                columns.append(f"{expr.this} AS {expr.alias}")
            else:
                columns.append(str(expr))
        break  # Only get the top-level SELECT
    return columns

def build_intermediate_query(base_query: str, up_to_clause: str) -> str:
    """Build a query up to a specific clause for intermediate results"""
    ast = sqlglot.parse_one(base_query, read='sqlite')
    
    # Create a new query by removing clauses after the target
    if up_to_clause == 'FROM':
        # Just get all data from tables
        tables = extract_table_names(ast)
        if tables:
            return f"SELECT * FROM {tables[0]}"
    
    elif up_to_clause == 'JOIN':
        # Remove WHERE, GROUP BY, ORDER BY
        new_ast = ast.copy()
        for node in list(new_ast.find_all(exp.Where)):
            node.parent.set('where', None)
        for node in list(new_ast.find_all(exp.Group)):
            node.parent.set('group', None)
        for node in list(new_ast.find_all(exp.Having)):
            node.parent.set('having', None)
        for node in list(new_ast.find_all(exp.Order)):
            node.parent.set('order', None)
        return str(new_ast)
    
    elif up_to_clause == 'WHERE':
        # Remove GROUP BY, ORDER BY
        new_ast = ast.copy()
        for node in list(new_ast.find_all(exp.Group)):
            node.parent.set('group', None)
        for node in list(new_ast.find_all(exp.Having)):
            node.parent.set('having', None)
        for node in list(new_ast.find_all(exp.Order)):
            node.parent.set('order', None)
        return str(new_ast)
    
    elif up_to_clause == 'GROUP':
        # Remove HAVING, ORDER BY
        new_ast = ast.copy()
        for node in list(new_ast.find_all(exp.Having)):
            node.parent.set('having', None)
        for node in list(new_ast.find_all(exp.Order)):
            node.parent.set('order', None)
        return str(new_ast)
    
    elif up_to_clause == 'HAVING':
        # Remove ORDER BY
        new_ast = ast.copy()
        for node in list(new_ast.find_all(exp.Order)):
            node.parent.set('order', None)
        return str(new_ast)
    
    return base_query

def generate_visualization_steps(query: str) -> List[Dict[str, Any]]:
    """Generate step-by-step visualization using AST"""
    steps = []
    
    try:
        # Parse the query into an AST
        ast = sqlglot.parse_one(query, read='sqlite')
        
        # Extract components from AST
        tables = extract_table_names(ast)
        joins = extract_join_info(ast)
        where_clause = extract_where_clause(ast)
        group_by = extract_group_by(ast)
        having_clause = extract_having_clause(ast)
        order_by = extract_order_by(ast)
        select_cols = extract_select_columns(ast)
        
        step_number = 1
        
        # Step 1: FROM clause
        if tables:
            main_table = tables[0]
            columns, data = get_table_data(main_table)
            steps.append({
                "title": f"Step {step_number}: FROM Clause",
                "description": f"Starting with all rows from the '{main_table}' table.",
                "data": data,
                "clause": "FROM"
            })
            step_number += 1
        
        # Step 2: JOIN operations
        if joins:
            for join in joins:
                try:
                    intermediate_query = build_intermediate_query(query, 'JOIN')
                    columns, rows = execute_query_safe(intermediate_query)
                    
                    step_data = []
                    for row in rows:
                        step_data.append(dict(zip(columns, row)))
                    
                    join_desc = f"{join['type']} JOIN with {join['table']}"
                    if join['on']:
                        join_desc += f" ON {join['on']}"
                    
                    steps.append({
                        "title": f"Step {step_number}: JOIN Operation",
                        "description": join_desc,
                        "data": step_data,
                        "clause": "JOIN"
                    })
                    step_number += 1
                    break  # Show first join, can be enhanced for multiple joins
                except Exception as e:
                    print(f"JOIN step error: {e}")
        
        # Step 3: WHERE clause
        if where_clause:
            try:
                intermediate_query = build_intermediate_query(query, 'WHERE')
                columns, rows = execute_query_safe(intermediate_query)
                
                step_data = []
                for row in rows:
                    step_data.append(dict(zip(columns, row)))
                
                steps.append({
                    "title": f"Step {step_number}: WHERE Clause",
                    "description": f"Filtering rows where: {where_clause}",
                    "data": step_data,
                    "clause": "WHERE"
                })
                step_number += 1
            except Exception as e:
                print(f"WHERE step error: {e}")
        
        # Step 4: GROUP BY clause
        if group_by:
            try:
                intermediate_query = build_intermediate_query(query, 'GROUP')
                columns, rows = execute_query_safe(intermediate_query)
                
                step_data = []
                for row in rows:
                    step_data.append(dict(zip(columns, row)))
                
                group_cols = ', '.join(group_by)
                # Check for aggregate functions
                aggregates = []
                for col in select_cols:
                    if any(agg in col.upper() for agg in ['COUNT', 'SUM', 'AVG', 'MAX', 'MIN']):
                        aggregates.append(col)
                
                desc = f"Grouping by {group_cols}"
                if aggregates:
                    desc += f" and calculating: {', '.join(aggregates)}"
                
                steps.append({
                    "title": f"Step {step_number}: GROUP BY Clause",
                    "description": desc,
                    "data": step_data,
                    "clause": "GROUP BY"
                })
                step_number += 1
            except Exception as e:
                print(f"GROUP BY step error: {e}")
        
        # Step 5: HAVING clause
        if having_clause:
            try:
                intermediate_query = build_intermediate_query(query, 'HAVING')
                columns, rows = execute_query_safe(intermediate_query)
                
                step_data = []
                for row in rows:
                    step_data.append(dict(zip(columns, row)))
                
                steps.append({
                    "title": f"Step {step_number}: HAVING Clause",
                    "description": f"Filtering groups where: {having_clause}",
                    "data": step_data,
                    "clause": "HAVING"
                })
                step_number += 1
            except Exception as e:
                print(f"HAVING step error: {e}")
        
        # Step 6: SELECT clause (final column selection)
        if select_cols and select_cols != ['*']:
            try:
                # Execute without ORDER BY to show selection
                intermediate_query = build_intermediate_query(query, 'HAVING' if having_clause else 'GROUP' if group_by else 'WHERE' if where_clause else 'JOIN' if joins else 'FROM')
                columns, rows = execute_query_safe(intermediate_query)
                
                step_data = []
                for row in rows:
                    step_data.append(dict(zip(columns, row)))
                
                cols_desc = ', '.join(select_cols)
                steps.append({
                    "title": f"Step {step_number}: SELECT Clause",
                    "description": f"Selecting columns: {cols_desc}",
                    "data": step_data,
                    "clause": "SELECT"
                })
                step_number += 1
            except Exception as e:
                print(f"SELECT step error: {e}")
        
        # Step 7: ORDER BY clause
        if order_by:
            try:
                columns, rows = execute_query_safe(query)
                
                step_data = []
                for row in rows:
                    step_data.append(dict(zip(columns, row)))
                
                order_desc = ', '.join([f"{o['column']} {o['direction']}" for o in order_by])
                steps.append({
                    "title": f"Step {step_number}: ORDER BY Clause",
                    "description": f"Sorting results by: {order_desc}",
                    "data": step_data,
                    "clause": "ORDER BY"
                })
                step_number += 1
            except Exception as e:
                print(f"ORDER BY step error: {e}")
        
    except Exception as e:
        print(f"Visualization generation error: {e}")
        # Fallback: just show final results
        try:
            columns, rows = execute_query_safe(query)
            step_data = []
            for row in rows:
                step_data.append(dict(zip(columns, row)))
            
            steps.append({
                "title": "Step 1: Query Results",
                "description": "Final query results (detailed visualization unavailable)",
                "data": step_data,
                "clause": "RESULT"
            })
        except:
            pass
    
    return steps

@app.route('/api/query', methods=['POST'])
def run_query():
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        # Security check: only allow SELECT queries
        if not query.upper().startswith('SELECT'):
            return jsonify({
                'error': 'Only SELECT queries are allowed. Please start your query with SELECT.'
            }), 400
        
        # Validate SQL syntax using sqlglot
        try:
            ast = sqlglot.parse_one(query, read='sqlite')
        except sqlglot.errors.ParseError as e:
            return jsonify({
                'error': f'SQL Syntax Error: {str(e)}. Please check your query syntax.'
            }), 400
        
        # Generate visualization steps
        try:
            visualization = generate_visualization_steps(query)
        except Exception as e:
            return jsonify({
                'error': f'Visualization Error: {str(e)}. The query may be too complex to visualize.'
            }), 500
        
        # Execute the actual query
        try:
            columns, rows = execute_query_safe(query)
        except sqlite3.Error as e:
            error_msg = str(e)
            # Provide more helpful error messages
            if 'no such table' in error_msg.lower():
                return jsonify({
                    'error': f'Database Error: {error_msg}. The table does not exist in the database.'
                }), 400
            elif 'no such column' in error_msg.lower():
                return jsonify({
                    'error': f'Database Error: {error_msg}. The column does not exist in the table.'
                }), 400
            elif 'syntax error' in error_msg.lower():
                return jsonify({
                    'error': f'SQL Syntax Error: {error_msg}. Please check your query syntax.'
                }), 400
            else:
                return jsonify({
                    'error': f'Database Error: {error_msg}'
                }), 400
        
        # Format response
        response = {
            'results': {
                'columns': columns,
                'rows': rows
            },
            'visualization': visualization
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Server Error: {str(e)}. Please try again or simplify your query.'
        }), 500

@app.route('/api/schema', methods=['GET'])
def get_schema():
    """Return the database schema"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        schema = {}
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        for table in tables:
            table_name = table[0]
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            
            schema[table_name] = [
                {
                    'name': col[1],
                    'type': col[2],
                    'pk': col[5] == 1
                }
                for col in columns
            ]
        
        conn.close()
        return jsonify(schema), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
