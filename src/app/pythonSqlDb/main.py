from flask import Flask, request, jsonify
import sqlite3
from productosSheinIdentity import ProductDB


app = Flask(__name__)
conn = sqlite3.connect('shein.db')

c = conn.cursor()

c.execute( """CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY,
    nombre_usuario TEXT,
    tienda TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio_pvp REAL,
    precio_pvapp REAL,
    nombre_producto TEXT
); """ )

conn.commit()
conn.close()

db = ProductDB()



@app.route('/productos', methods=['POST'])
def crear_producto():
    data = request.json
    db.crear_producto(data['nombre_usuario'], data['tienda'], data['precio_pvp'], data['precio_pvapp'], data['nombre_producto'])
    return jsonify({'mensaje': 'Producto creado exitosamente'}), 201

@app.route('/productos', methods=['GET'])
def obtener_todos_los_productos():
    productos = db.obtener_todos_los_productos()
    if productos:
        return jsonify(productos), 200
    else:
        return jsonify({'mensaje': 'No hay productos disponibles'}), 404


@app.route('/productos/<int:producto_id>', methods=['PUT'])
def actualizar_producto(producto_id):
    data = request.json
    db.actualizar_producto(producto_id, data['nombre_usuario'], data['tienda'], data['precio_pvp'], data['precio_pvapp'], data['nombre_producto'])
    return jsonify({'mensaje': 'Producto actualizado exitosamente'}), 200

@app.route('/productos/<int:producto_id>', methods=['DELETE'])
def eliminar_producto(producto_id):
    db.eliminar_producto(producto_id)
    return jsonify({'mensaje': 'Producto eliminado exitosamente'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=6000)

