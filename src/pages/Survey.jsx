import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import '../styles/survey.css'

const questions = [
  ['seenAppBefore', 'Have you ever come across a lost and found app before?', ['Yes', 'No']],
  ['lostBefore', 'Have you ever lost an important document or personal item?', ['Yes', 'No']],
  ['recovered', 'Were you able to recover it?', ['Yes', 'No']],
  ['ratings', 'How would you rate the service at Home Affairs, the Licensing Department or another department?'],
  ['replacementFeeFair', 'Do you think the fee paid to replace a lost document is fair and reasonable?', ['Yes', 'No']],
  ['usefulness', 'How useful would a service like this be in your community?', ['Very useful', 'Somewhat useful', 'Not useful', 'Not sure yet']],
  ['recommend', 'Would you recommend this service to someone?', ['Yes', 'Maybe', 'No']],
  ['subscribe', 'Would you subscribe to a service provider that assists with lost document recovery?', ['Yes', 'No', 'Maybe']],
  ['willingToPay', 'How much would you be willing to pay for a recovered item, from R20 to R100?'],
  ['interest', 'Would you like to get involved?', ['Just sharing feedback', 'Help test the app', 'Volunteer in my community', 'Explore becoming a collection partner']],
]
const ratings = [['queueRating', 'Time spent in queues'], ['helpDeskRating', 'Information at the help desk'], ['customerServiceRating', 'Customer service']]
export default function Survey() {
  const [answers, setAnswers] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const update = (key, value) => setAnswers(a => ({ ...a, [key]: value }))
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    try {
      await apiRequest('/surveys', 'POST', answers)
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <main className="survey-shell">
    <header className="survey-intro"><p className="landing-eyebrow">Community voices · Back 2 Owner</p>
      <h1>Conduct a community survey</h1>
      <p>Ask each question and record the respondent’s answers. Read the introduction and privacy note to them before starting. Participation is voluntary.</p>
      <div className="survey-tags"><span>About 5 minutes</span><span>Admin-led interview</span><span>Contact details optional</span></div>
    </header>
    {done ? <section className="survey-card survey-thanks" role="status"><span className="survey-check" aria-hidden="true">✓</span><h2>Thank you for having your say.</h2><p>Your response has been saved. You are helping us build a service that works for our community.</p><button className="btn" type="button" onClick={() => { setAnswers({}); setError(''); setDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Next respondent</button><Link to="/admin/survey">View survey responses</Link></section> : <form className="survey-card" onSubmit={submit}>
      <aside className="survey-explainer"><strong>New to Back 2 Owner?</strong><p>Found items are recorded by collection partners and reviewed by an administrator. Owners can browse, submit a claim and collect after verification. Matching identity details can also help notify an owner.</p><Link to="/" target="_blank" rel="noreferrer">Explore the app in a new tab ↗</Link></aside>
      <p className="survey-note">Read to the respondent: Taking part is voluntary. We use your answers to improve Back 2 Owner and plan the community pilot. You can skip the interview or stop at any time. Contact details are optional. Complete the applicable questions to save a response. Skip question 3 if no item was lost. Service ratings are optional if the respondent has no experience of these departments.</p>
      {questions.map(([key, label, options], index) => <fieldset key={key} disabled={key === 'recovered' && answers.lostBefore !== 'Yes'}><legend><span className="survey-number">{index + 1}</span>{label}</legend>
        {key === 'recovered' && answers.lostBefore !== 'Yes' ? <p className="survey-note">Not applicable unless the respondent answered Yes to question 2.</p> : options ? <div className="survey-options">{options.map(option => <label className="survey-choice" key={option}><input type="radio" name={key} value={option} required checked={answers[key] === option} onChange={e => update(key, e.target.value)} /><span>{option}</span></label>)}</div> : key === 'ratings' ? <><p className="survey-note">1 = Poor · 10 = Excellent. Leave blank if not applicable.</p>{ratings.map(([field, text]) => <label className="survey-field" key={field}>{text}<select value={answers[field] || ''} onChange={e => update(field, e.target.value)}><option value="">Not applicable / no experience</option>{Array.from({ length: 10 }, (_, i) => <option value={i + 1} key={i}>{i + 1}</option>)}</select></label>)}</> : <label className="survey-field">Amount in rand (R)<input type="number" min="20" max="100" step="1" required value={answers.willingToPay || ''} onChange={e => update('willingToPay', e.target.value)} /></label>}
        {key === 'lostBefore' && answers.lostBefore === 'Yes' && <label className="survey-field">What was it?<input maxLength={300} required value={answers.lostItem || ''} onChange={e => update('lostItem', e.target.value)} /></label>}
        {key === 'recovered' && answers.lostBefore === 'Yes' && answers.recovered === 'Yes' && <label className="survey-field">How did you recover it?<input maxLength={500} required value={answers.recoveryMethod || ''} onChange={e => update('recoveryMethod', e.target.value)} /></label>}
      </fieldset>)}
      <label className="survey-field">What would make you more comfortable using a lost and found service? <small>(optional)</small><textarea maxLength={1000} rows={4} value={answers.feedback || ''} onChange={e => update('feedback', e.target.value)} placeholder="Tell us what matters to you. Please leave out ID numbers and private document details." /></label>
      <section className="survey-contact"><h2>Keep in touch <small>(optional)</small></h2><p>Want to help test, volunteer or discuss a partnership? Leave a phone number or email and give us permission to contact you about your interest.</p><label className="survey-field">Phone number or email<input maxLength={120} autoComplete="off" value={answers.contact || ''} onChange={e => update('contact', e.target.value)} /></label><label className="survey-consent"><input type="checkbox" required={Boolean(answers.contact?.trim())} checked={answers.contactConsent || false} onChange={e => update('contactConsent', e.target.checked)} /><span>The respondent explicitly agreed that the Back 2 Owner team may contact them about testing, volunteering or partnering. Read this permission request aloud before ticking.</span></label></section>
      <p className="survey-note">We use your answers to improve Back 2 Owner and plan the community pilot. Only authorised administrators can review responses. Do not include ID numbers, document copies or passwords.</p>
      {error && <p role="alert" className="survey-error">{error} Your answers are still here. Please try again.</p>}
      <button className="btn survey-submit" type="submit" disabled={busy}>{busy ? 'Saving your feedback…' : 'Save respondent’s feedback'}</button>
    </form>}
    <footer className="survey-footer">Back 2 Owner · Lost property, responsibly returned</footer>
  </main>
}
