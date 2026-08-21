const Joi = require('joi');
const { AppError } = require('../middlewares/errorHandler');

const objectId = Joi.string().hex().length(24);
const email = Joi.string().email({ tlds: { allow: false } });
const roles = ['admin', 'supervisor', 'scholar', 'hod', 'drc', 'librarian'];
const userStatus = ['Active', 'Inactive'];
const researchStages = ['Course Work', 'Synopsis Preparation', 'Literature Review', 'Data Collection', 'Thesis Writing', 'Viva Voce', 'Completed'];
const researchStatus = ['Active', 'Completed', 'Discontinued'];
const submissionStatus = ['Pending Supervisor Approval', 'Approved by Supervisor', 'Pending DRC Review', 'Approved by DRC', 'Needs DRC Revision'];
const meetingTypes = ['Viva Voce', 'Synopsis Review', 'Doctoral Committee', 'Progress Review', 'Regular Review', 'Other'];
const meetingStatus = ['Scheduled', 'Completed', 'Cancelled'];

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return next(new AppError('Validation failed', 400, errors));
    }

    req[source] = value;
    return next();
  };
}

const schemas = {
  idParam: Joi.object({ id: objectId.required() }),
  scholarIdParam: Joi.object({ scholarId: objectId.required() }),
  login: Joi.object({
    email: email.required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...roles).required()
  }),
  createUser: Joi.object({
    name: Joi.string().required(),
    email: email.required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...roles).required(),
    dept: Joi.string().required(),
    status: Joi.string().valid(...userStatus).default('Active'),
    joined: Joi.string().default(() => new Date().toISOString().slice(0, 10))
  }),
  updateUser: Joi.object({
    name: Joi.string(),
    email,
    password: Joi.string().min(6),
    role: Joi.string().valid(...roles),
    dept: Joi.string(),
    status: Joi.string().valid(...userStatus)
  }).min(1),
  assignSupervisor: Joi.object({
    supervisorId: objectId.required()
  }),
  listUsers: Joi.object({
    role: Joi.string().valid(...roles).allow(''),
    status: Joi.string().valid(...userStatus).allow(''),
    supervisorId: Joi.string().allow(''),
    supervisorName: Joi.string().allow(''),
    search: Joi.string().allow(''),
    all: Joi.string().allow('')
  }).unknown(true),
  createResearch: Joi.object({
    scholar: Joi.string().required(),
    scholarId: objectId,
    topic: Joi.string().required(),
    supervisor: Joi.string().required(),
    supervisorId: objectId,
    dept: Joi.string().required(),
    startDate: Joi.string().required(),
    stage: Joi.string().valid(...researchStages).default('Course Work'),
    progress: Joi.number().min(0).max(100).default(0),
    status: Joi.string().valid(...researchStatus).default('Active')
  }),
  updateResearch: Joi.object({
    topic: Joi.string(),
    supervisor: Joi.string(),
    supervisorId: objectId,
    stage: Joi.string().valid(...researchStages),
    progress: Joi.number().min(0).max(100),
    status: Joi.string().valid(...researchStatus)
  }).min(1),
  listResearch: Joi.object({
    status: Joi.string().valid(...researchStatus).allow(''),
    stage: Joi.string().valid(...researchStages).allow('')
  }),
  createSubmission: Joi.object({
    topic: Joi.string().allow('', null),
    version: Joi.string().allow('', null),
    remarks: Joi.string().allow('', null),
    period: Joi.string().allow('', null),
    category: Joi.string().allow('', null),
    workDone: Joi.string().allow('', null),
    planNext: Joi.string().allow('', null),
    drcMeetingDate: Joi.string().allow('', null),
    approvalDate: Joi.string().allow('', null)
  }),
  updateSubmissionStatus: Joi.object({
    status: Joi.string().required(),
    remarks: Joi.string().allow('', null),
    drcMeetingDate: Joi.string().allow('', null),
    approvalDate: Joi.string().allow('', null)
  }),
  createMeeting: Joi.object({
    scholar: Joi.string().required(),
    type: Joi.string().required(),
    date: Joi.string().required(),
    time: Joi.string().required(),
    venue: Joi.string().default('TBD'),
    mode: Joi.string().allow('', null),
    agenda: Joi.string().allow('', null),
    panel: Joi.string().allow('', null),
    supervisor: Joi.string().allow('', null),
    status: Joi.string().valid(...meetingStatus).default('Scheduled')
  }).unknown(true),
  updateMeeting: Joi.object({
    scholar: Joi.string(),
    type: Joi.string().valid(...meetingTypes),
    date: Joi.string(),
    time: Joi.string(),
    venue: Joi.string(),
    panel: Joi.string().allow('', null),
    supervisor: Joi.string().allow('', null),
    status: Joi.string().valid(...meetingStatus)
  }).min(1),
  createMinute: Joi.object({
    committee: Joi.string().required(),
    meetingDate: Joi.string().required(),
    agenda: Joi.string().required(),
    decisions: Joi.string().required(),
    writer: Joi.string().default('DRC'),
    status: Joi.string().valid('Draft', 'Signed').default('Draft')
  }),
  scholarReportQuery: Joi.object({
    name: Joi.string().required()
  })
};

module.exports = { validate, schemas };
