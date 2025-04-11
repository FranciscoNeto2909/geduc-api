const Task = require("../models/task")
const fs = require("fs")

module.exports = {
    async all(req, res) {
        try {
            const tasks = await Task.findAll()
            res.status(200).json(tasks)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    async one(req, res) {
        try {
            const id = req.params.id
            const task = await Task.findOne({ where: { id } })
            if (!task) {
                return res.status(400).json("Task not found!")
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
                return res.status(400).json("Erro: tasks alredy exist!")
            } else {
                await Task.create(data)
                const newTask = await Task.findOne({ where: { title } })

                res.status(201).json({
                    erro: false,
                    msg: "Task registered successfully!",
                    id: newTask.id
                })
            }
        } catch (error) {
            res.status(400).json("faltam dados" + error)
        }
    },

    async update(req, res) {
        try {
            const id = req.params.id

            const task = await Task.findOne({ where: { id } })
            if (!task) {
                return res.status(400).json("Task not found!")
            }
            else {
                task.title = req.body.title
                task.desc = req.body.desc
                task.urgency = req.body.urgency

                await task.save()

                return res.status(201).json({
                    erro: false,
                    msg: "Task updated!"
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
                return res.status(400).json("Task not found!")
            }

            await task.destroy()
            await task.save()

            return res.status(201).json({
                erro: false,
                msg: "Task removed!"
            })

        } catch (error) {
            res.status(400).send(error)
        }
    }
}