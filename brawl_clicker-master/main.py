import os
import sqlite3
from flask import Flask, render_template, request, jsonify

# Создаём объект Flask
app = Flask(__name__, template_folder='templates')

# Путь к базе данных
DATABASE = 'clicks.db'


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    # Создание таблицы пользователей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            telegram_id INTEGER UNIQUE NOT NULL,
            clicks INTEGER DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()



# Инициализация базы данных при запуске
init_db()


@app.route('/')
def home():
    return render_template('page1.html')

@app.route('/identify', methods=['POST'])
def identify():
    data = request.get_json()
    telegram_id = data.get('telegram_id')

    if not telegram_id:
        return jsonify({'success': False, 'message': 'Не получен Telegram ID.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE telegram_id = ?', (telegram_id,))
    user = cursor.fetchone()

    if not user:
        # Регистрация нового пользователя
        cursor.execute('INSERT INTO users (telegram_id, clicks) VALUES (?, ?)', (telegram_id, 0))
        conn.commit()
        current_clicks = 0
    else:
        current_clicks = user['clicks']

    conn.close()
    return jsonify({'success': True, 'clicks': current_clicks})



@app.route('/page2')
def page2():
    return render_template('page2.html')


@app.route('/page3')
def page3():
    return render_template('page3.html')


@app.route('/page4')
def page4():
    return render_template('page4.html')


@app.route('/page5')
def page5():
    return render_template('page5.html')


@app.route('/page6')
def page6():
    return render_template('page6.html')


@app.route('/fons')
def fons():
    return render_template('fons.html')


@app.route('/page8')
def page8():
    return render_template('page8.html')


@app.route('/page9')
def page9():
    return render_template('page9.html')


@app.route('/page10')
def page10():
    return render_template('page10.html')


@app.route('/page11')
def page11():
    return render_template('page11.html')


@app.route('/upgrade')
def upgrade():
    return render_template('upgrade.html')


@app.route('/click', methods=['POST'])
def click():
    data = request.get_json()
    telegram_id = data.get('telegram_id')

    if not telegram_id:
        return jsonify({'success': False, 'message': 'Не получен Telegram ID.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET clicks = clicks + 1 WHERE telegram_id = ?', (telegram_id,))
    conn.commit()
    cursor.execute('SELECT clicks FROM users WHERE telegram_id = ?', (telegram_id,))
    current_clicks = cursor.fetchone()['clicks']
    conn.close()
    return jsonify({'success': True, 'clicks': current_clicks})


if __name__ == '__main__':
    app.run(debug=True, port=8000)