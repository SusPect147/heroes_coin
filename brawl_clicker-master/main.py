import os
import json
from flask import Flask, render_template, request, jsonify

# Указываем путь к папке templates
app = Flask(__name__, template_folder='D:/MyGame/heroes_coin', static_folder='static')

# Загрузка монет из файла
COINS_FILE = 'D:/MyGame/heroes_coin/brawl_clicker-master/coins.json'

def load_coins():
    try:
        with open(COINS_FILE, 'r') as f:
            return json.load(f).get('total_coins', 0)
    except:
        return 0

def save_coins(coins):
    with open(COINS_FILE, 'w') as f:
        json.dump({'total_coins': coins}, f)

total_coins = load_coins()

@app.route('/')
def home():
    return render_template('index.html', total_coins=total_coins)

@app.route('/click', methods=['POST'])
def click():
    global total_coins
    total_coins += 1
    save_coins(total_coins)
    return jsonify({'success': True, 'total_coins': total_coins})

@app.route('/update_coins', methods=['POST'])
def update_coins():
    global total_coins
    data = request.get_json()
    coins = data.get('coins', 0)
    total_coins = coins
    save_coins(total_coins)
    return jsonify({'success': True, 'total_coins': total_coins})

if __name__ == '__main__':
    app.run(debug=True, port=8000)