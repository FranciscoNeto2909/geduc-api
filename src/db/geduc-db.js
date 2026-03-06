const pool = require("../configs/db");

module.exports = {
  // Buscar registro Geduc por ID (geralmente id = 1)
  async findOneById(id) {
    try {
      const [rows] = await pool.execute("SELECT * FROM geduc WHERE id = ?", [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo registro Geduc
  async create(data) {
    try {
      const {
        phone,
        whatsapp,
        instagram,
        linkedin,
        address,
        address2,
        support,
        contact,
        commercial,
      } = data;

      const [result] = await pool.execute(
        `INSERT INTO geduc (phone, whatsapp, instagram, linkedin, address, address2, support, contact, commercial) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          phone,
          whatsapp,
          instagram,
          linkedin,
          address,
          address2,
          support,
          contact,
          commercial,
        ]
      );

      return { id: result.insertId, ...data };
    } catch (error) {
      throw error;
    }
  },

  // Atualizar registro Geduc
  async update(id, data) {
    try {
      const fields = [];
      const values = [];

      if (data.phone !== undefined) {
        fields.push("phone = ?");
        values.push(data.phone);
      }
      if (data.whatsapp !== undefined) {
        fields.push("whatsapp = ?");
        values.push(data.whatsapp);
      }
      if (data.instagram !== undefined) {
        fields.push("instagram = ?");
        values.push(data.instagram);
      }
      if (data.linkedin !== undefined) {
        fields.push("linkedin = ?");
        values.push(data.linkedin);
      }
      if (data.address !== undefined) {
        fields.push("address = ?");
        values.push(data.address);
      }
      if (data.address2 !== undefined) {
        fields.push("address2 = ?");
        values.push(data.address2);
      }
      if (data.support !== undefined) {
        fields.push("support = ?");
        values.push(data.support);
      }
      if (data.contact !== undefined) {
        fields.push("contact = ?");
        values.push(data.contact);
      }
      if (data.commercial !== undefined) {
        fields.push("commercial = ?");
        values.push(data.commercial);
      }

      if (fields.length === 0) {
        return null;
      }

      values.push(id);
      const query = `UPDATE geduc SET ${fields.join(", ")} WHERE id = ?`;

      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        return null;
      }

      return await this.findOneById(id);
    } catch (error) {
      throw error;
    }
  },
};
