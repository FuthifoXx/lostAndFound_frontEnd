import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import '../styles/survey.css'

const questions = [
  ['experience', 'Have you tried Back 2 Owner?', ['I have only heard about it', 'I watched a demonstration', 'I have used it myself']],
  ['lostBefore', 'Have you ever lost an important document or personal item?', ['Yes', 'No', 'Prefer not to say']],
  ['usefulness', 'How useful would Back 2 Owner be in your community?', ['Very useful', 'Somewhat useful', 'Not useful', 'Not sure yet']],
  ['recommend', 'Would you recommend Back 2 Owner to someone?', ['Yes', 'Maybe', 'No']],
  ['interest', 'Would you like to get involved?', ['Just sharing feedback', 'Help test the app', 'Volunteer in my community', 'Explore becoming a collection partner']],
]
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
      <div className="survey-tags"><span>About 2 minutes</span><span>Admin-led interview</span><span>Contact details optional</span></div>
    </header>
    {done ? <section className="survey-card survey-thanks" role="status"><span className="survey-check" aria-hidden="true">✓</span><h2>Thank you for having your say.</h2><p>Your response has been saved. You are helping us build a service that works for our community.</p><button className="btn" type="button" onClick={() => { setAnswers({}); setError(''); setDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Next respondent</button><Link to="/admin/survey">View survey responses</Link></section> : <form className="survey-card" onSubmit={submit}>
      <aside className="survey-explainer"><strong>New to Back 2 Owner?</strong><p>Found items are recorded by collection partners and reviewed by an administrator. Owners can browse, submit a claim and collect after verification. Matching identity details can also help notify an owner.</p><Link to="/" target="_blank" rel="noreferrer">Explore the app in a new tab ↗</Link></aside>
      <p className="survey-note">Read to the respondent: Taking part is voluntary. We use your answers to improve Back 2 Owner and plan the community pilot. You can skip the interview or stop at any time. Contact details are optional. Questions 1–5 are required to save a response.</p>
      {questions.map(([key, label, options], index) => <fieldset key={key}><legend><span className="survey-number">{index + 1}</span>{label}</legend><div className="survey-options">{options.map(option => <label className="survey-choice" key={option}><input type="radio" name={key} value={option} required checked={answers[key] === option} onChange={e => update(key, e.target.value)} /><span>{option}</span></label>)}</div></fieldset>)}
      {answers.experience && answers.experience !== 'I have only heard about it' && <fieldset><legend>How easy was it to understand or use? <small>(optional)</small></legend><div className="survey-options">{['Easy', 'Some parts were confusing', 'Difficult', 'Not sure'].map(value => <label className="survey-choice" key={value}><input type="radio" name="ease" value={value} checked={answers.ease === value} onChange={() => update('ease', value)} /><span>{value}</span></label>)}</div></fieldset>}
      <label className="survey-field">What would make you more comfortable using Back 2 Owner? <small>(optional)</small><textarea maxLength={1000} rows={4} value={answers.feedback || ''} onChange={e => update('feedback', e.target.value)} placeholder="Tell us what matters to you. Please leave out ID numbers and private document details." /></label>
      <section className="survey-contact"><h2>Keep in touch <small>(optional)</small></h2><p>Want to help test, volunteer or discuss a partnership? Leave a phone number or email and give us permission to contact you about your interest.</p><label className="survey-field">Phone number or email<input maxLength={120} autoComplete="off" value={answers.contact || ''} onChange={e => update('contact', e.target.value)} /></label><label className="survey-consent"><input type="checkbox" required={Boolean(answers.contact?.trim())} checked={answers.contactConsent || false} onChange={e => update('contactConsent', e.target.checked)} /><span>The respondent explicitly agreed that the Back 2 Owner team may contact them about testing, volunteering or partnering. Read this permission request aloud before ticking.</span></label></section>
      <p className="survey-note">We use your answers to improve Back 2 Owner and plan the community pilot. Only authorised administrators can review responses. Do not include ID numbers, document copies or passwords.</p>
      {error && <p role="alert" className="survey-error">{error} Your answers are still here. Please try again.</p>}
      <button className="btn survey-submit" type="submit" disabled={busy}>{busy ? 'Saving your feedback…' : 'Save respondent’s feedback'}</button>
    </form>}
    <footer className="survey-footer">Back 2 Owner · Lost property, responsibly returned</footer>
  </main>
}
