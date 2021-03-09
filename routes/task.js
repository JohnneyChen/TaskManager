const express = require('express')

const { validateTask } = require('../validationSchemas')
const { getTaskNew, postTaskNew, getTask, getTaskEdit, patchTask, deleteTask } = require('../controllers/task')

const router = express.Router({ mergeParams: true })

router.post('/', validateTask, postTaskNew)

router.get('/new', getTaskNew)

router.get('/:taskId/edit', getTaskEdit)

router.route('/:taskId')
    .get(getTask)
    .patch(validateTask, patchTask)
    .delete(deleteTask)

module.exports = router