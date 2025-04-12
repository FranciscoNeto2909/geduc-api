const Task = require("../models/task")
const fs = require("fs")

module.exports = {
    async all(req, res) {
        try {
            const tasks = await Task.findAll()
            if (tasks.length > 0) {
                res.status(200).json(tasks)
            } else{
                res.status(200).json([])
            }
        } catch (error) {
            res.status(400).send(error)
        }
    },
    async one(req, res) {
        try {
            const id = req.params.id
            const task = await Task.findOne({ where: { id } })
            if (!task) {
                return res.status(400).json("Tarefa não encontrada!")
            }
            res.status(200).json(task)
        } catch (error) {
            res.status(400).send(error)
        }
    },

    async create(req, res) {
        try {
            const data = req.body
            const { title } = data
            const task = await Task.findOne({ where: { title } })

            if (task) {
                return res.status(400).json("Erro: tarefa ja existe!")
            } else {
                await Task.create(data)
                const newTask = await Task.findOne({ where: { title } })

                res.status(201).json({
                    erro: false,
                    msg: "Tarefa adicionada com sucesso!",
                    id: newTask.id
                })
            }
        } catch (error) {
            res.status(400).json({
                msg:"faltam dados",
                erro: error
            })
        }
    },

    async update(req, res) {
        try {
            const id = req.params.id

            const task = await Task.findOne({ where: { id } })
            if (!task) {
                return res.status(400).json("Tarefa não encontrada!")
            }
            else {
                task.title = req.body.title
                task.desc = req.body.desc
                task.urgency = req.body.urgency

                await task.save()

                return res.status(201).json({
                    erro: false,
                    msg: "Tarefa atualizada!"
                })
            }
        } catch (error) {
            res.status(400).send(error)
        }
    },
    async delete(req, res) {
        try {
            const id = req.params.id
            const task = await Task.findOne({ where: { id } })

            if (!task) {
                return res.status(400).json("Tarefa não encontrada!")
            }

            await task.destroy()
            await task.save()

            return res.status(201).json({
                erro: false,
                msg: "Tarefa apagada!"
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }
}