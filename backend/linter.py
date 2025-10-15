# linter.py
import sqlglot
from typing import List, Dict

def analyze_query(query: str) -> List[Dict[str, str]]:
    """
    Analyze a SQL query and provide tips for improvement.
    Returns a list of tip objects with 'type', 'title', and 'message' fields.
    """
    tips = []
    query_lower = query.lower().strip()
    
    # Rule 1: Check for 'SELECT *'
    if 'select *' in query_lower or 'select*' in query_lower:
        tips.append({
            "type": "best_practice",
            "title": "💡 Best Practice Tip",
            "message": "Avoid using `SELECT *` in production code. Explicitly naming your columns makes the query more readable, maintainable, and less prone to breaking if the table schema changes. It also reduces network overhead by only retrieving the data you need."
        })
    
    # Rule 2: Check for LIKE with a leading wildcard
    if "like '%'%" in query_lower.replace(' ', '') or 'like "%' in query_lower.replace(' ', ''):
        tips.append({
            "type": "performance",
            "title": "⚡ Performance Tip",
            "message": "Using a wildcard `%` at the beginning of a `LIKE` pattern (e.g., `LIKE '%text'`) prevents the database from using indexes, which can lead to slow performance on large tables. Consider using full-text search features or restructuring your query if possible."
        })
    
    # Rule 3: Suggest uppercase keywords for readability
    try:
        parsed = sqlglot.parse_one(query, read='sqlite')
        # Check if keywords are lowercase
        keywords = ['select', 'from', 'where', 'join', 'group', 'order', 'having']
        has_lowercase_keywords = any(kw in query_lower and kw == query[query_lower.find(kw):query_lower.find(kw)+len(kw)] for kw in keywords)
        
        if has_lowercase_keywords:
            tips.append({
                "type": "readability",
                "title": "📖 Readability Tip",
                "message": "It's a common SQL convention to write keywords (SELECT, FROM, WHERE, JOIN, etc.) in uppercase to make queries easier to read and maintain. This helps distinguish keywords from table and column names."
            })
    except:
        pass
    
    # Rule 4: Check for missing WHERE on UPDATE/DELETE (safety check)
    # Note: We block these queries anyway, but this is a good educational tip
    if ('update ' in query_lower or 'delete ' in query_lower) and 'where' not in query_lower:
        tips.append({
            "type": "warning",
            "title": "⚠️ Safety Warning",
            "message": "UPDATE or DELETE without a WHERE clause will affect ALL rows in the table! This is rarely what you want. Always use a WHERE clause to specify which rows should be modified."
        })
    
    # Rule 5: Check for NOT IN with potential NULLs
    if 'not in' in query_lower:
        tips.append({
            "type": "correctness",
            "title": "🔍 Correctness Tip",
            "message": "Be careful with `NOT IN` when the subquery might return NULL values. NULLs can cause unexpected behavior. Consider using `NOT EXISTS` or `LEFT JOIN ... WHERE ... IS NULL` instead."
        })
    
    # Rule 6: Check for multiple JOINs without explicit JOIN type
    join_count = query_lower.count('join')
    explicit_join_count = query_lower.count('inner join') + query_lower.count('left join') + query_lower.count('right join') + query_lower.count('full join')
    
    if join_count > 1 and explicit_join_count < join_count:
        tips.append({
            "type": "best_practice",
            "title": "💡 Best Practice Tip",
            "message": "When using multiple JOINs, explicitly specify the JOIN type (INNER, LEFT, RIGHT) for each one. This makes your intent clear and helps prevent errors. While 'JOIN' defaults to INNER JOIN, being explicit improves readability."
        })
    
    # Rule 7: Check for COUNT(column) vs COUNT(*)
    if 'count(' in query_lower and 'count(*)' not in query_lower:
        tips.append({
            "type": "knowledge",
            "title": "📚 Knowledge Tip",
            "message": "Remember: `COUNT(column_name)` counts non-NULL values in that column, while `COUNT(*)` counts all rows regardless of NULL values. Choose based on your specific needs."
        })
    
    # Rule 8: Check for ORDER BY without LIMIT (potential performance issue)
    if 'order by' in query_lower and 'limit' not in query_lower and 'top' not in query_lower:
        tips.append({
            "type": "performance",
            "title": "⚡ Performance Tip",
            "message": "If you're only interested in the top N results, add a LIMIT clause. Sorting the entire result set and then only using a few rows is inefficient. For example: `ORDER BY salary DESC LIMIT 10`."
        })
    
    # Rule 9: Suggest table aliases for readability
    if 'from' in query_lower and 'join' in query_lower:
        # Check if aliases are being used
        try:
            parsed = sqlglot.parse_one(query, read='sqlite')
            # This is a simple check - a more robust version would parse the AST
            words = query.split()
            has_aliases = any(len(w) == 1 and w.isalpha() for w in words)
            
            if not has_aliases:
                tips.append({
                    "type": "readability",
                    "title": "📖 Readability Tip",
                    "message": "When joining tables, use short table aliases (e.g., `FROM employees e JOIN departments d`) to make your query more concise and easier to read, especially when referencing columns."
                })
        except:
            pass
    
    # Rule 10: Check for ambiguous column names in JOINs
    if 'join' in query_lower and 'select' in query_lower:
        # Look for column names without table prefix
        if 'select *' not in query_lower:
            try:
                # Check if there are column names without table/alias prefix
                select_part = query_lower.split('from')[0].replace('select', '').strip()
                columns = [c.strip() for c in select_part.split(',')]
                has_unqualified = any('.' not in col and ' as ' not in col and col != '*' for col in columns)
                
                if has_unqualified:
                    tips.append({
                        "type": "best_practice",
                        "title": "💡 Best Practice Tip",
                        "message": "When joining tables, qualify column names with their table name or alias (e.g., `e.name` instead of just `name`). This prevents ambiguity and makes it clear which table each column comes from."
                    })
            except:
                pass
    
    return tips

def get_query_complexity_score(query: str) -> Dict[str, any]:
    """
    Calculate a complexity score for the query based on various factors.
    Returns a dict with score and breakdown.
    """
    score = 0
    factors = []
    
    query_lower = query.lower()
    
    # Basic SELECT
    score += 1
    factors.append("Basic SELECT: +1")
    
    # WHERE clause
    if 'where' in query_lower:
        score += 1
        factors.append("WHERE clause: +1")
    
    # JOIN
    join_count = query_lower.count('join')
    if join_count > 0:
        score += join_count * 2
        factors.append(f"JOINs ({join_count}): +{join_count * 2}")
    
    # GROUP BY
    if 'group by' in query_lower:
        score += 2
        factors.append("GROUP BY: +2")
    
    # HAVING
    if 'having' in query_lower:
        score += 2
        factors.append("HAVING: +2")
    
    # ORDER BY
    if 'order by' in query_lower:
        score += 1
        factors.append("ORDER BY: +1")
    
    # Aggregate functions
    aggregates = ['count(', 'sum(', 'avg(', 'max(', 'min(']
    agg_count = sum(query_lower.count(agg) for agg in aggregates)
    if agg_count > 0:
        score += agg_count
        factors.append(f"Aggregate functions ({agg_count}): +{agg_count}")
    
    # Determine level
    if score <= 2:
        level = "Beginner"
    elif score <= 5:
        level = "Intermediate"
    elif score <= 8:
        level = "Advanced"
    else:
        level = "Expert"
    
    return {
        "score": score,
        "level": level,
        "factors": factors
    }
