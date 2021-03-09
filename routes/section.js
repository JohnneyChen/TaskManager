const express = require('express')

const { getSections, getSectionNew, postSectionNew, getSection, getSectionEdit, patchSection, deleteSection } = require('../controllers/section')
const { validateSection } = require('../validationSchemas')

const router = express.Router()

router.get('/:sectionId/edit', getSectionEdit)

router.get('/new', getSectionNew)

router.route('/')
    .get(getSections)
    .post(validateSection, postSectionNew)

router.route('/:sectionId')
    .get(getSection)
    .patch(validateSection, patchSection)
    .delete(deleteSection)

module.exports = router