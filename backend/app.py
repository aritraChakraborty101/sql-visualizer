from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import sqlparse
from sqlparse.sql import IdentifierList, Identifier, Where, Token
from sqlparse.tokens import Keyword, DML

app = Flask(__name__)
CORS(app)

DATABASE = 'employees.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def parse_query_components(query):
    """Parse SQL query to extract components"""
    parsed = sqlparse.parse(query)[0]
    components = {
        'select': [],
        'from': [],
        'where': None,
        'join': [],
        'group_by': [],
        'order_by': []
    }
    
    current_keyword = None
    
    for token in parsed.tokens:
        if token.ttype is Keyword.DML and token.value.upper() == 'SELECT':
            current_keyword = 'select'
        elif token.ttype is Keyword and token.value.upper() in ('FROM', 'WHERE', 'GROUP', 'ORDER', 'JOIN', 'LEFT', 'RIGHT', 'INNER'):
            if token.value.upper() == 'FROM':
                current_keyword = 'from'
            elif token.value.upper() == 'WHERE':
                current_keyword = 'where'
            elif token.value.upper() in ('GROUP', 'ORDER'):
                next_token = str(token.value).upper()
                if 'GROUP' in next_token:
                    current_keyword = 'group_by'
                elif 'ORDER' in next_token:
                    current_keyword = 'order_by'
            elif token.value.upper() in ('JOIN', 'LEFT', 'RIGHT', 'INNER'):
                current_keyword = 'join'
        elif not token.is_whitespace:
            if current_keyword == 'select' and isinstance(token, IdentifierList):
                components['select'] = [str(identifier).strip() for identifier in token.get_identifiers()]
            elif current_keyword == 'select' and isinstance(token, Identifier):
                components['select'].append(str(token).strip())
            elif current_keyword == 'from' and isinstance(token, (Identifier, IdentifierList)):
                if isinstance(token, IdentifierList):
                    components['from'] = [str(identifier).strip() for identifier in token.get_identifiers()]
                else:
                    components['from'].append(str(token).strip())
            elif current_keyword == 'where':
                components['where'] = str(token).strip()
    
    return components

def get_table_data(table_name):
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

def execute_query(query):
    """Execute the actual SQL query"""
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

def generate_visualization_steps(query, components):
    """Generate step-by-step visualization of query execution"""
    steps = []
    
    # Step 1: FROM clause
    if components['from']:
        from_tables = components['from']
        step_data = []
        step_title = "Step 1: FROM Clause"
        
        if len(from_tables) == 1:
            table_name = from_tables[0].split()[0]  # Handle aliases
            columns, data = get_table_data(table_name)
            step_data = data
            step_description = f"Starting with all rows from the '{table_name}' table."
        else:
            # Handle joins (simplified version)
            step_description = f"Combining data from tables: {', '.join(from_tables)}"
            # For simplicity, we'll execute a basic join
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                from_clause = ' '.join(from_tables)
                cursor.execute(f"SELECT * FROM {from_clause}")
                columns = [description[0] for description in cursor.description]
                rows = cursor.fetchall()
                conn.close()
                
                for row in rows:
                    step_data.append(dict(zip(columns, row)))
            except:
                step_data = []
        
        steps.append({
            "title": step_title,
            "description": step_description,
            "data": step_data
        })
    
    # Step 2: JOIN clause (if applicable)
    # Check if query contains JOIN
    if 'JOIN' in query.upper():
        step_title = "Step 2: JOIN Operation"
        step_description = "Joining tables based on the specified condition."
        
        # Execute up to the join to get intermediate results
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            # Extract query up to WHERE clause
            join_query = query.split('WHERE')[0] if 'WHERE' in query.upper() else query
            join_query = join_query.split('GROUP BY')[0] if 'GROUP BY' in join_query.upper() else join_query
            join_query = join_query.split('ORDER BY')[0] if 'ORDER BY' in join_query.upper() else join_query
            
            cursor.execute(join_query)
            columns = [description[0] for description in cursor.description]
            rows = cursor.fetchall()
            conn.close()
            
            step_data = []
            for row in rows:
                step_data.append(dict(zip(columns, row)))
            
            steps.append({
                "title": step_title,
                "description": step_description,
                "data": step_data
            })
        except:
            pass
    
    # Step 3: WHERE clause
    if components['where']:
        step_title = f"Step {len(steps) + 1}: WHERE Clause"
        step_description = f"Filtering rows where: {components['where']}"
        
        # Execute query up to WHERE to get filtered results
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            where_query = query.split('GROUP BY')[0] if 'GROUP BY' in query.upper() else query
            where_query = where_query.split('ORDER BY')[0] if 'ORDER BY' in where_query.upper() else where_query
            
            cursor.execute(where_query)
            columns = [description[0] for description in cursor.description]
            rows = cursor.fetchall()
            conn.close()
            
            step_data = []
            for row in rows:
                step_data.append(dict(zip(columns, row)))
            
            steps.append({
                "title": step_title,
                "description": step_description,
                "data": step_data
            })
        except:
            pass
    
    # Step 4: GROUP BY clause
    if 'GROUP BY' in query.upper():
        step_title = f"Step {len(steps) + 1}: GROUP BY Clause"
        step_description = "Grouping rows based on specified columns."
        
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            group_query = query.split('ORDER BY')[0] if 'ORDER BY' in query.upper() else query
            
            cursor.execute(group_query)
            columns = [description[0] for description in cursor.description]
            rows = cursor.fetchall()
            conn.close()
            
            step_data = []
            for row in rows:
                step_data.append(dict(zip(columns, row)))
            
            steps.append({
                "title": step_title,
                "description": step_description,
                "data": step_data
            })
        except:
            pass
    
    # Step 5: SELECT clause
    step_title = f"Step {len(steps) + 1}: SELECT Clause"
    if components['select']:
        cols = ', '.join(components['select'])
        step_description = f"Selecting columns: {cols}"
    else:
        step_description = "Selecting all columns (*)"
    
    # Execute full query without ORDER BY
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        select_query = query.split('ORDER BY')[0] if 'ORDER BY' in query.upper() else query
        
        cursor.execute(select_query)
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()
        conn.close()
        
        step_data = []
        for row in rows:
            step_data.append(dict(zip(columns, row)))
        
        steps.append({
            "title": step_title,
            "description": step_description,
            "data": step_data
        })
    except:
        pass
    
    # Step 6: ORDER BY clause
    if 'ORDER BY' in query.upper():
        step_title = f"Step {len(steps) + 1}: ORDER BY Clause"
        step_description = "Sorting the final results."
        
        try:
            columns, rows = execute_query(query)
            
            step_data = []
            for row in rows:
                row_dict = {}
                for i, col in enumerate(columns):
                    row_dict[col] = row[i]
                step_data.append(row_dict)
            
            steps.append({
                "title": step_title,
                "description": step_description,
                "data": step_data
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
            return jsonify({'error': 'Only SELECT queries are allowed'}), 400
        
        # Parse query components
        components = parse_query_components(query)
        
        # Generate visualization steps
        visualization = generate_visualization_steps(query, components)
        
        # Execute the actual query
        columns, rows = execute_query(query)
        
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
        return jsonify({'error': str(e)}), 500

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
