import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Claim } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, claim

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  claim = await Claim.create({})
})

test('POST /claims 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, Files: 'test', UserID: 'test', Title: 'test', Description: 'test', Status: 'test', SubmissionDate: 'test', InsuranceCompany: 'test', Employer: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.Files).toEqual('test')
  expect(body.UserID).toEqual('test')
  expect(body.Title).toEqual('test')
  expect(body.Description).toEqual('test')
  expect(body.Status).toEqual('test')
  expect(body.SubmissionDate).toEqual('test')
  expect(body.InsuranceCompany).toEqual('test')
  expect(body.Employer).toEqual('test')
})

test('POST /claims 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /claims 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /claims 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /claims 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /claims 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /claims/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${claim.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(claim.id)
})

test('GET /claims/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${claim.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /claims/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${claim.id}`)
  expect(status).toBe(401)
})

test('GET /claims/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /claims/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${claim.id}`)
    .send({ access_token: adminSession, Files: 'test', UserID: 'test', Title: 'test', Description: 'test', Status: 'test', SubmissionDate: 'test', InsuranceCompany: 'test', Employer: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(claim.id)
  expect(body.Files).toEqual('test')
  expect(body.UserID).toEqual('test')
  expect(body.Title).toEqual('test')
  expect(body.Description).toEqual('test')
  expect(body.Status).toEqual('test')
  expect(body.SubmissionDate).toEqual('test')
  expect(body.InsuranceCompany).toEqual('test')
  expect(body.Employer).toEqual('test')
})

test('PUT /claims/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${claim.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /claims/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${claim.id}`)
  expect(status).toBe(401)
})

test('PUT /claims/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, Files: 'test', UserID: 'test', Title: 'test', Description: 'test', Status: 'test', SubmissionDate: 'test', InsuranceCompany: 'test', Employer: 'test' })
  expect(status).toBe(404)
})

test('DELETE /claims/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${claim.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /claims/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${claim.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /claims/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${claim.id}`)
  expect(status).toBe(401)
})

test('DELETE /claims/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
