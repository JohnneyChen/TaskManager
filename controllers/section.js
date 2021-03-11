const pool = require('../mysqlConnection')

const getSections = (req, res) => {
    pool.query('SELECT label, sections.id AS id, COUNT(task.id) AS task_count FROM sections LEFT JOIN task ON task.section_id=sections.id GROUP BY sections.id', (error, result) => {
        if (error) {
            throw error
        }
        console.log(result)
        res.render('sections/index', { result })
    });
}

const getSectionNew = (req, res) => {
    res.render('sections/new')
}

const postSectionNew = (req, res) => {
    const q = 'INSERT INTO sections(label) VALUES ?'
    const label = [[req.body.section.label]]
    pool.query(q, [label], (error, result) => {
        if (error) {
            throw error
        }
        req.flash('success', "Successfully created a new section!")
        res.redirect('/sections')
    });
}

const getSection = (req, res) => {
    const { sectionId } = req.params
    const q = 'SELECT sections.id AS section_id, label, task, due, priority, task.id AS task_id FROM sections LEFT JOIN task ON task.section_id=sections.id WHERE sections.id=?'
    pool.query(q, sectionId, (error, result) => {
        if (error) {
            throw error
        }
        res.render('sections/show', { result })
    });
}

const getSectionEdit = (req, res) => {
    const { sectionId } = req.params
    const q = 'SELECT * FROM sections WHERE sections.id=?'
    pool.query(q, sectionId, (error, result) => {
        if (error) {
            throw error
        }
        console.log(result)
        res.render('sections/edit', { result })
    });
}

const patchSection = (req, res) => {
    const { sectionId } = req.params
    const { label } = req.body.section
    const q = 'UPDATE sections SET label=? WHERE id=?'
    pool.query(q, [label, sectionId], (error, result) => {
        if (error) {
            throw error
        }
        req.flash('success', "Successfully edited the section!")
        res.redirect(`${sectionId}`)
    });
}

const deleteSection = (req, res) => {
    const { sectionId } = req.params
    q = 'DELETE FROM sections WHERE id=?'
    pool.query(q, sectionId, (error, result) => {
        if (error) {
            throw error
        }
        req.flash('success', "Successfully deleted the section!")
        res.redirect(`/sections`)
    });
}


module.exports.getSections = getSections
module.exports.getSectionNew = getSectionNew
module.exports.postSectionNew = postSectionNew
module.exports.getSection = getSection
module.exports.getSectionEdit = getSectionEdit
module.exports.patchSection = patchSection
module.exports.deleteSection = deleteSection
