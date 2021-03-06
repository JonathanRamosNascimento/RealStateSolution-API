const Immobile = require('../models/Immobile');

module.exports = {
  async index(req, res) {
    try {
      if (req.query.tamanho) {
        const { tamanho, quarto, suite, banheiro, piso, varanda, garagem, piscina, moveisImbutidos, bairro, cidade, estado } = req.query;
        const immobiles = await Immobile.find({ $and: [{ tamanho: { $gte: tamanho } }, { quarto }, { suite }, { banheiro }, { piso }, { varanda }, { garagem }, { piscina }, { moveisImbutidos }, { bairro }, { cidade }, { estado }] });

        return res.json(immobiles);
      }
      const resposta = await Immobile.find();
      return res.json(resposta);
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params;

      const immobile = await Immobile.findById(id);
      const dicas = await Immobile.find({ bairro: immobile.bairro });

      return res.send({ imovel: immobile, dicas });
    } catch (error) {
      return res.status(400).send({ error: err });
    }
  },

  async store(req, res) {
    try {
      const immobile = await Immobile.create(req.body);

      return res.status(201).json(immobile);
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  },

  async update(req, res) {
    return res.send('Update');
  },

  async delete(req, res) {
    return res.send('Delete');
  }
}