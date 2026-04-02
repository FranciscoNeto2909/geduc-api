const pool = require("../configs/db");

module.exports = {
  // Buscar todos os posts
  async findAll() {
    try {
      const [rows] = await pool.execute("SELECT * FROM posts ORDER BY createdAt DESC");
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Buscar post por ID
  async findOneById(id) {
    try {
      const [rows] = await pool.execute("SELECT * FROM posts WHERE id = ?", [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Buscar post por título
  async findOneByTitle(title) {
    try {
      const [rows] = await pool.execute("SELECT * FROM posts WHERE title = ?", [title]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo post
  async create(data) {
    try {
      const { image, title, subtitle, text, rule } = data;

      const [result] = await pool.execute(
        `INSERT INTO posts (image, title, subtitle, text, rule) 
         VALUES (?, ?, ?, ? ,?)`,
        [image || null, title, subtitle, text, rule]
      );

      return { id: result.insertId, ...data };
    } catch (error) {
      throw error;
    }
  },

  // Atualizar post
  async update(id, data) {
    try {
      const fields = [];
      const values = [];

      if (data.image !== undefined) {
        fields.push("image = ?");
        values.push(data.image);
      }
      if (data.title !== undefined) {
        fields.push("title = ?");
        values.push(data.title);
      }
      if (data.subtitle !== undefined) {
        fields.push("subtitle = ?");
        values.push(data.subtitle);
      }
      if (data.text !== undefined) {
        fields.push("text = ?");
        values.push(data.text);
      }

      if (fields.length === 0) {
        return null;
      }

      values.push(id);
      const query = `UPDATE posts SET ${fields.join(", ")} WHERE id = ?`;

      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.findOneById(id);
    } catch (error) {
      throw error;
    }
  },

  // Deletar post
  async delete(id) {
    try {
      const [result] = await pool.execute("DELETE FROM posts WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },
};
