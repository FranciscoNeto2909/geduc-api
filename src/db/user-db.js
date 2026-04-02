const pool = require("../configs/db");

module.exports = {
  // Buscar todos os usuários
  async findAll() {
    try {
      const [rows] = await pool.execute("SELECT * FROM user");
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Buscar usuário por ID
  async findOneById(id) {
    try {
      const [rows] = await pool.execute("SELECT * FROM user WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Buscar usuário por email
  async findOneByEmail(email) {
    try {
      const [rows] = await pool.execute("SELECT * FROM user WHERE email = ?", [
        email,
      ]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo usuário
  async create(data) {
    try {
      const { name, lastName, image, phone, email, password, rule, isLogged } =
        data;

      const [result] = await pool.execute(
        `INSERT INTO user (name, lastName, image, phone, email, password, rule, isLogged) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, lastName, image || null, phone, email, password, rule, isLogged],
      );

      return { id: result.insertId, ...data };
    } catch (error) {
      throw error;
    }
  },

  // Atualizar usuário
  async update(id, data) {
    try {
      const fields = [];
      const values = [];

      if (data.name !== undefined) {
        fields.push("name = ?");
        values.push(data.name);
      }
      if (data.lastName !== undefined) {
        fields.push("lastName = ?");
        values.push(data.lastName);
      }
      if (data.image !== undefined) {
        fields.push("image = ?");
        values.push(data.image);
      }
      if (data.phone !== undefined) {
        fields.push("phone = ?");
        values.push(data.phone);
      }
      if (data.email !== undefined) {
        fields.push("email = ?");
        values.push(data.email);
      }
      if (data.password !== undefined) {
        fields.push("password = ?");
        values.push(data.password);
      }
      if (data.isLogged !== undefined) {
        fields.push("isLogged = ?");
        values.push(data.isLogged);
      }
      if (data.isAdmin !== undefined) {
        fields.push("isAdmin = ?");
        values.push(data.isAdmin);
      }

      if (fields.length === 0) {
        return null;
      }

      values.push(id);
      const query = `UPDATE user SET ${fields.join(", ")} WHERE id = ?`;

      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.findOneById(id);
    } catch (error) {
      throw error;
    }
  },

  // Atualizar campo específico (útil para isLogged)
  async updateField(id, field, value) {
    try {
      // Whitelist de campos permitidos para segurança
      const allowedFields = [
        "name",
        "lastName",
        "image",
        "phone",
        "email",
        "password",
        "isLogged",
        "isAdmin",
      ];

      if (!allowedFields.includes(field)) {
        throw new Error(`Campo '${field}' não é permitido`);
      }

      const [result] = await pool.execute(
        `UPDATE user SET ${field} = ? WHERE id = ?`,
        [value, id],
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.findOneById(id);
    } catch (error) {
      throw error;
    }
  },

  // Deletar usuário
  async delete(id) {
    try {
      const [result] = await pool.execute("DELETE FROM user WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },
};
