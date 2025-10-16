from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import sqlglot
from sqlglot import exp
from typing import List, Dict, Any, Optional
import json
import os
from linter import analyze_query, get_query_complexity_score

app = Flask(__name__)

# Configure CORS - allows both local development and production
# Update the GitHub Pages URL with your actual username before deploying
cors_origins = [
    "http://localhost:3000",  # Local React development
    "http://127.0.0.1:3000",  # Alternative local address
    "https://aritrachakraborty101.github.io/sql-visualizer/",    # GitHub Pages (all repos)
]

# Add your specific GitHub Pages URL for better security (recommended)
# Uncomment and update before deploying:
# cors_origins.append("https://yourusername.github.io")

CORS(app, resources={
    r"/api/*": {
        "origins": cors_origins,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

DATABASE = 'employees.db'
CASE_DATABASE = 'omnicorp_case.db'

def get_db_connection(database=DATABASE):
    conn = sqlite3.connect(database)
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
        
        # Remove SQL comments from the beginning to check for SELECT
        query_check = query
        # Remove single-line comments
        while query_check.lstrip().startswith('--'):
            query_check = query_check.split('\n', 1)[1] if '\n' in query_check else ''
        query_check = query_check.strip()
        
        # Security check: only allow SELECT queries
        if not query_check.upper().startswith('SELECT'):
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
        
        # Analyze query for tips
        tips = analyze_query(query)
        
        # Get complexity score
        complexity = get_query_complexity_score(query)
        
        # Format response
        response = {
            'results': {
                'columns': columns,
                'rows': rows
            },
            'visualization': visualization,
            'tips': tips,
            'complexity': complexity
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

@app.route('/api/curriculum', methods=['GET'])
def get_curriculum():
    """Return the learning curriculum"""
    try:
        with open('curriculum.json', 'r') as f:
            curriculum = json.load(f)
        return jsonify(curriculum), 200
    except FileNotFoundError:
        return jsonify({'error': 'Curriculum file not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_lesson_by_id(lesson_id: str) -> Optional[Dict]:
    """Find a lesson by its ID in the curriculum"""
    try:
        with open('curriculum.json', 'r') as f:
            curriculum = json.load(f)
        
        for module in curriculum['modules']:
            for lesson in module['lessons']:
                if lesson['id'] == lesson_id:
                    return lesson
        return None
    except:
        return None

def normalize_query_results(rows):
    """Normalize query results for comparison"""
    # Convert to list of tuples and sort for consistent comparison
    normalized = [tuple(row) for row in rows]
    return sorted(normalized)

@app.route('/api/validate', methods=['POST'])
def validate_challenge():
    """Validate a user's query against a lesson's solution"""
    try:
        data = request.get_json()
        user_query = data.get('query', '').strip()
        lesson_id = data.get('lesson_id')
        
        if not user_query or not lesson_id:
            return jsonify({'error': 'Missing query or lesson_id'}), 400
        
        # Get the lesson
        lesson = get_lesson_by_id(lesson_id)
        if not lesson:
            return jsonify({'error': 'Lesson not found'}), 404
        
        # Remove SQL comments from the beginning to check for SELECT
        query_check = user_query
        # Remove single-line comments
        while query_check.lstrip().startswith('--'):
            query_check = query_check.split('\n', 1)[1] if '\n' in query_check else ''
        query_check = query_check.strip()
        
        # Security check
        if not query_check.upper().startswith('SELECT'):
            return jsonify({
                'is_correct': False,
                'feedback': 'Only SELECT queries are allowed.'
            }), 200
        
        try:
            # Execute user's query
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute(user_query)
            user_columns = [description[0] for description in cursor.description]
            user_results = cursor.fetchall()
            user_results_normalized = normalize_query_results(user_results)
            
            # Execute solution query
            cursor.execute(lesson['solution_query'])
            solution_columns = [description[0] for description in cursor.description]
            solution_results = cursor.fetchall()
            solution_results_normalized = normalize_query_results(solution_results)
            
            conn.close()
            
            # Compare results
            columns_match = user_columns == solution_columns
            results_match = user_results_normalized == solution_results_normalized
            
            is_correct = columns_match and results_match
            
            if is_correct:
                feedback = "🎉 Correct! Well done! You can move on to the next lesson."
            elif not columns_match:
                feedback = f"The columns don't match. Expected: {', '.join(solution_columns)}, but got: {', '.join(user_columns)}. Check your SELECT clause."
            else:
                feedback = f"The results don't match the expected output. You got {len(user_results)} rows, expected {len(solution_results)} rows. Check your WHERE, JOIN, or GROUP BY clauses."
            
            return jsonify({
                'is_correct': is_correct,
                'feedback': feedback,
                'user_row_count': len(user_results),
                'expected_row_count': len(solution_results)
            }), 200
            
        except sqlite3.Error as e:
            return jsonify({
                'is_correct': False,
                'feedback': f'Database Error: {str(e)}. Check your query syntax and table/column names.'
            }), 200
        except Exception as e:
            return jsonify({
                'is_correct': False,
                'feedback': f'Error executing query: {str(e)}'
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/case/load', methods=['GET'])
def load_case():
    """Load the case file configuration"""
    try:
        with open('case_file.json', 'r') as f:
            case_data = json.load(f)
        return jsonify(case_data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Case file not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/case/schema', methods=['GET'])
def get_case_schema():
    """Return the case database schema"""
    try:
        conn = get_db_connection(CASE_DATABASE)
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

def validate_stage_result(user_result, validation_config):
    """Validate user query results against stage requirements"""
    user_columns, user_rows = user_result
    validation_type = validation_config.get('type')
    
    if validation_type == 'exact_columns':
        required_cols = validation_config.get('required_columns', [])
        expected_data = validation_config.get('expected_data', [])
        
        # Check if required columns exist
        for req_col in required_cols:
            if req_col not in user_columns:
                return False, f"Missing required column: {req_col}"
        
        # Check if data matches
        if len(user_rows) != len(expected_data):
            return False, f"Expected {len(expected_data)} row(s), got {len(user_rows)}"
        
        # Compare data values
        for exp_row in expected_data:
            found = False
            for user_row in user_rows:
                user_dict = dict(zip(user_columns, user_row))
                match = all(user_dict.get(k) == v for k, v in exp_row.items())
                if match:
                    found = True
                    break
            if not found:
                return False, f"Expected data not found in results"
        
        return True, "Correct!"
    
    elif validation_type == 'contains_ids':
        required_cols = validation_config.get('required_columns', [])
        expected_ids = validation_config.get('expected_employee_ids', [])
        min_count = validation_config.get('min_count', 0)
        
        if 'employee_id' not in user_columns:
            return False, "Query must return employee_id column"
        
        emp_id_idx = user_columns.index('employee_id')
        found_ids = set(row[emp_id_idx] for row in user_rows)
        
        if len(found_ids) < min_count:
            return False, f"Expected at least {min_count} employees, found {len(found_ids)}"
        
        for exp_id in expected_ids:
            if exp_id not in found_ids:
                return False, f"Missing expected employee ID: {exp_id}"
        
        return True, "All suspects identified!"
    
    elif validation_type == 'contains_names':
        required_cols = validation_config.get('required_columns', [])
        expected_names = validation_config.get('expected_names', [])
        
        if 'name' not in user_columns:
            return False, "Query must return 'name' column"
        
        name_idx = user_columns.index('name')
        found_names = set(row[name_idx] for row in user_rows)
        
        for exp_name in expected_names:
            if exp_name not in found_names:
                return False, f"Missing expected person: {exp_name}"
        
        return True, "Suspects identified correctly!"
    
    elif validation_type == 'exact_count_and_names':
        required_cols = validation_config.get('required_columns', [])
        expected_names = validation_config.get('expected_names', [])
        expected_count = validation_config.get('expected_count', 0)
        
        if 'name' not in user_columns:
            return False, "Query must return 'name' column"
        
        if len(user_rows) != expected_count:
            return False, f"Expected exactly {expected_count} results, got {len(user_rows)}"
        
        name_idx = user_columns.index('name')
        found_names = set(row[name_idx] for row in user_rows)
        
        for exp_name in expected_names:
            if exp_name not in found_names:
                return False, f"Missing expected person: {exp_name}"
        
        return True, "Correct capability analysis!"
    
    elif validation_type == 'ordered_sequence':
        required_cols = validation_config.get('required_columns', [])
        must_be_ordered = validation_config.get('must_be_ordered', False)
        must_contain_action = validation_config.get('must_contain_action')
        
        for col in required_cols:
            if col not in user_columns:
                return False, f"Missing required column: {col}"
        
        if must_contain_action and 'action' in user_columns:
            action_idx = user_columns.index('action')
            actions = [row[action_idx] for row in user_rows]
            if must_contain_action not in actions:
                return False, f"Results must contain action: {must_contain_action}"
        
        if must_be_ordered and 'timestamp' in user_columns:
            ts_idx = user_columns.index('timestamp')
            timestamps = [row[ts_idx] for row in user_rows]
            if timestamps != sorted(timestamps):
                return False, "Results must be ordered by timestamp"
        
        return True, "Timeline constructed correctly!"
    
    elif validation_type == 'contains_text':
        required_cols = validation_config.get('required_columns', [])
        keywords = validation_config.get('must_contain_keywords', [])
        min_results = validation_config.get('min_results', 1)
        
        if len(user_rows) < min_results:
            return False, f"Expected at least {min_results} result(s)"
        
        # Check if any row contains the keywords
        found_keyword = False
        for row in user_rows:
            row_text = ' '.join(str(val) for val in row)
            if any(keyword in row_text for keyword in keywords):
                found_keyword = True
                break
        
        if not found_keyword:
            return False, "Memo with relevant information not found"
        
        return True, "Motive discovered!"
    
    elif validation_type == 'final_report':
        must_include_employee = validation_config.get('must_include_employee')
        must_show_deletion = validation_config.get('must_show_deletion', False)
        required_info = validation_config.get('required_info', [])
        
        # Check if employee 202 data is present
        has_employee = False
        has_deletion = False
        
        for row in user_rows:
            row_str = ' '.join(str(val) for val in row)
            if str(must_include_employee) in row_str or 'Marcus Vale' in row_str:
                has_employee = True
            if must_show_deletion and 'DELETED' in row_str:
                has_deletion = True
        
        if not has_employee:
            return False, f"Report must include data about employee {must_include_employee}"
        
        if must_show_deletion and not has_deletion:
            return False, "Report must show the deletion action"
        
        return True, "Case solved! Evidence compiled successfully!"
    
    return False, "Validation type not recognized"

@app.route('/api/case/solve', methods=['POST'])
def solve_case_stage():
    """Validate user's query for a specific case stage"""
    try:
        data = request.get_json()
        user_query = data.get('query', '').strip()
        stage_id = data.get('stage_id')
        
        if not user_query or not stage_id:
            return jsonify({'error': 'Missing query or stage_id'}), 400
        
        # Load case file
        with open('case_file.json', 'r') as f:
            case_data = json.load(f)
        
        stage = case_data['stages'].get(stage_id)
        if not stage:
            return jsonify({'error': 'Stage not found'}), 404
        
        # Security check
        query_check = user_query
        while query_check.lstrip().startswith('--'):
            query_check = query_check.split('\n', 1)[1] if '\n' in query_check else ''
        query_check = query_check.strip()
        
        if not query_check.upper().startswith('SELECT'):
            return jsonify({
                'is_correct': False,
                'feedback': 'Only SELECT queries are allowed.'
            }), 200
        
        try:
            # Execute user's query against case database
            conn = get_db_connection(CASE_DATABASE)
            cursor = conn.cursor()
            
            cursor.execute(user_query)
            user_columns = [description[0] for description in cursor.description]
            user_rows = cursor.fetchall()
            user_rows_list = [list(row) for row in user_rows]
            
            conn.close()
            
            # Validate against stage requirements
            validation = stage.get('validation', {})
            is_correct, feedback = validate_stage_result(
                (user_columns, user_rows_list),
                validation
            )
            
            response = {
                'is_correct': is_correct,
                'feedback': feedback,
                'user_row_count': len(user_rows_list),
            }
            
            if is_correct:
                response['clue_unlocked'] = stage.get('clue_unlocked')
                response['next_stage'] = stage.get('next_stage')
                
                # Check if this is the final stage
                if stage_id == 'final_stage':
                    response['completion_message'] = stage.get('completion_message')
            
            return jsonify(response), 200
            
        except sqlite3.Error as e:
            return jsonify({
                'is_correct': False,
                'feedback': f'Database Error: {str(e)}. Check your query syntax.'
            }), 200
        except Exception as e:
            return jsonify({
                'is_correct': False,
                'feedback': f'Error: {str(e)}'
            }), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
