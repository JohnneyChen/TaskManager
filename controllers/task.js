const pool = require('../mysqlConnection')

const getTaskNew = (req, res) => {
    const { sectionId } = req.params
    const q = 'SELECT id FROM sections WHERE id=?'
    pool.query(q, sectionId, (error, result) => {
        if (error) {
            throw error
        }
        res.render('tasks/new', { result })
    });

}

const postTaskNew = (req, res) => {
    let { sectionId } = req.params
    sectionId = parseInt(sectionId)
    let { task, due, description } = req.body.task
    let priority = false
    if (req.body.task.priority) {
        priority = true
    }
    const q = 'INSERT INTO task (task,due,description,priority,section_id) VALUES ?'
    const query = pool.query(q, [[[task, due, description, priority, sectionId]]], (error, result) => {
        if (error) {
            throw error
        }
        req.flash('success', "Successfully added a new task to the section!")
        res.redirect(`/sections/${sectionId}`)
    });

}

const getTask = (req, res) => {
    const { sectionId, taskId } = req.params
    const q = 'SELECT sections.id AS section_id, task.id AS task_id, task, DATE_FORMAT(due,"%Y-%m-%d") AS due, description,priority FROM sections INNER JOIN task ON task.section_id=sections.id WHERE task.id=?'
    pool.query(q, taskId, (error, result) => {
        if (error) {
            throw error
        }
        res.render('tasks/show', { result })
    });
}

const getTaskEdit = (req, res) => {
    const { sectionId, taskId } = req.params
    const q = 'SELECT sections.id AS section_id, task.id AS task_id, task, DATE_FORMAT(due,"%Y-%m-%d"), description,priority FROM sections INNER JOIN task ON task.section_id=sections.id WHERE task.id=?'
    pool.query(q, taskId, (error, result) => {
        if (error) {
            throw error
        }
        res.render('tasks/edit', { result })
    });
}

const patchTask = (req, res) => {
    const { sectionId, taskId } = req.params
    const { task, due, description } = req.body.task
    let priority = false
    if (req.body.task.priority) {
        priority = true
    }
    const queryValue = [task, due, description, priority, sectionId, taskId]
    const q = 'UPDATE task SET task=?,due=?,description=?,priority=?,section_id=? WHERE id=?'
    pool.query(q, queryValue, (error, result) => {
        if (error) {
            throw error
        }
        req.flash('success', "Successfully edited the task!")
        res.redirect(`/sections/${sectionId}/${taskId}`)
    });
}

const deleteTask = (req, res) => {
    const { sectionId, taskId } = req.params
    const q = 'DELETE FROM task WHERE id=?'
    pool.query(q, taskId, (error, result) => {
        if (error) {
            throw error
        }
        req.flash('success', "Successfully deleted the task!")
        res.redirect(`/sections/${sectionId}`)
    });
}

module.exports.getTaskNew = getTaskNew
module.exports.postTaskNew = postTaskNew
module.exports.getTask = getTask
module.exports.getTaskEdit = getTaskEdit
module.exports.patchTask = patchTask
module.exports.deleteTask = deleteTask