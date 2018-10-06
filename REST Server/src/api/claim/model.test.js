import { Claim } from '.'

let claim

beforeEach(async () => {
  claim = await Claim.create({ Files: 'test', UserID: 'test', Title: 'test', Description: 'test', Status: 'test', SubmissionDate: 'test', InsuranceCompany: 'test', Employer: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = claim.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(claim.id)
    expect(view.Files).toBe(claim.Files)
    expect(view.UserID).toBe(claim.UserID)
    expect(view.Title).toBe(claim.Title)
    expect(view.Description).toBe(claim.Description)
    expect(view.Status).toBe(claim.Status)
    expect(view.SubmissionDate).toBe(claim.SubmissionDate)
    expect(view.InsuranceCompany).toBe(claim.InsuranceCompany)
    expect(view.Employer).toBe(claim.Employer)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = claim.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(claim.id)
    expect(view.Files).toBe(claim.Files)
    expect(view.UserID).toBe(claim.UserID)
    expect(view.Title).toBe(claim.Title)
    expect(view.Description).toBe(claim.Description)
    expect(view.Status).toBe(claim.Status)
    expect(view.SubmissionDate).toBe(claim.SubmissionDate)
    expect(view.InsuranceCompany).toBe(claim.InsuranceCompany)
    expect(view.Employer).toBe(claim.Employer)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
