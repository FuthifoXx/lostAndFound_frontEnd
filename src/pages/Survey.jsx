import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import '../styles/survey.css'

const questions = [
  ['seenAppBefore', 'Have you ever come across a lost-and-found app before?', ['Yes', 'No']],
  ['lostBefore', 'Have you ever lost an important document or personal item?', ['Yes', 'No']],
  ['recovered', 'Were you able to recover it back?', ['Yes', 'No']],
  ['ratings', 'How would you rate the level of service at Home Affairs, the Licensing Department and other public service offices?'],
  ['replacementFeeFair', 'Do you think a fee paid to replace a lost document is fair and reasonable?', ['Yes', 'No']],
  ['usefulness', 'How useful would a service like this be in your community?', ['Very useful', 'Somewhat useful', 'Not useful', 'Not sure yet']],
  ['recommend', 'Would you recommend this service to someone?', ['Yes', 'Maybe', 'No']],
  ['subscribe', 'Would you subscribe to a service provider that assists with lost-document recovery?', ['Yes', 'No', 'Maybe']],
  ['willingToPay', 'How much are you willing to pay for a recovered item on a scale of R20 to R100?'],
  ['interest', 'Would you like to get involved?', ['Just sharing feedback', 'Help test the app', 'Volunteer in my community', 'Explore becoming a collection partner']],
]
const ratings = [['queueRating', 'Time spent in queues'], ['helpDeskRating', 'Level of information at the help desk'], ['customerServiceRating', 'Level of customer service']]
const comfortOptions = ['Strong privacy protection', 'Trusted local collection partners', 'Clear owner-verification process', 'Community / SAPS awareness', 'Reviews from other users', 'Clear explanation of how my information is used']
export default function Survey() {
  const [answers, setAnswers] = useState({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const update = (key, value) => setAnswers(a => ({ ...a, [key]: value }))
  const toggleComfort = (option) => setAnswers(a => {
    const current = Array.isArray(a.comfortFactors) ? a.comfortFactors : []
    return { ...a, comfortFactors: current.includes(option) ? current.filter(item => item !== option) : [...current, option] }
  })
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
    <header className="survey-intro"><img className="survey-logo" src="/back-2-owner-logo.png" alt="Back 2 Owner" /><p className="landing-eyebrow">Community Discovery Week · Pilot Phase 1</p>
      <h1>Back 2 Owner Community Survey</h1>
      <p>We are listening before we scale. This short interview helps us understand real experiences with lost documents, recovery, public services and trust in a local recovery network.</p>
      <div className="survey-tags"><span>About 5 minutes</span><span>Door-to-door interview</span><span>Voluntary</span><span>Contact details optional</span></div>
    </header>
    {done ? <section className="survey-card survey-thanks" role="status"><span className="survey-check" aria-hidden="true">✓</span><h2>Thank you for having your say.</h2><p>Your response has been saved. You are helping shape Back 2 Owner from the community outward.</p><button className="btn" type="button" onClick={() => { setAnswers({}); setError(''); setDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Next respondent</button><Link to="/admin/survey">View survey responses</Link></section> : <form className="survey-card" onSubmit={submit}>
      <aside className="survey-explainer"><strong>New to Back 2 Owner?</strong><p>Found items are recorded by collection partners and reviewed by an administrator. Owners can browse, submit a claim and collect after verification. Matching identity details can also help notify an owner.</p><Link to="/" target="_blank" rel="noreferrer">Explore the app in a new tab ↗</Link></aside>
      <div className="survey-readout"><strong>Read to the respondent</strong><p>Taking part is voluntary. We use your answers to improve Back 2 Owner and plan the community pilot. You may stop at any time. Contact details are optional. Please do not share ID numbers, document copies or passwords in this survey.</p></div>
      {questions.map(([key, label, options], index) => <fieldset key={key} disabled={key === 'recovered' && answers.lostBefore !== 'Yes'}><legend><span className="survey-number">{index + 1}</span>{label}</legend>
        {key === 'recovered' && answers.lostBefore !== 'Yes' ? <p className="survey-note">Not applicable unless the respondent answered Yes to question 2.</p> : options ? <div className="survey-options">{options.map(option => <label className="survey-choice" key={option}><input type="radio" name={key} value={option} required checked={answers[key] === option} onChange={e => update(key, e.target.value)} /><span>{option}</span></label>)}</div> : key === 'ratings' ? <><p className="survey-note">1 = Poor · 10 = Excellent. Leave blank if not applicable.</p>{ratings.map(([field, text]) => <label className="survey-field" key={field}>{text}<select value={answers[field] || ''} onChange={e => update(field, e.target.value)}><option value="">Not applicable / no experience</option>{Array.from({ length: 10 }, (_, i) => <option value={i + 1} key={i}>{i + 1}</option>)}</select></label>)}</> : <label className="survey-field">Amount in rand (R20–R100)<input type="number" min="20" max="100" step="1" required value={answers.willingToPay || ''} onChange={e => update('willingToPay', e.target.value)} /></label>}
        {key === 'lostBefore' && answers.lostBefore === 'Yes' && <label className="survey-field">What was it?<input maxLength={300} required value={answers.lostItem || ''} onChange={e => update('lostItem', e.target.value)} /></label>}
        {key === 'recovered' && answers.lostBefore === 'Yes' && answers.recovered === 'Yes' && <label className="survey-field">How did you recover it?<input maxLength={500} required value={answers.recoveryMethod || ''} onChange={e => update('recoveryMethod', e.target.value)} /></label>}
      </fieldset>)}
      <section className="survey-comfort">
        <h2>What would make you more comfortable using a lost-and-found service? <small>(optional)</small></h2>
        <p className="survey-note">Select all that apply.</p>
        <div className="survey-options survey-options-two">{comfortOptions.map(option => <label className="survey-choice" key={option}><input type="checkbox" checked={(answers.comfortFactors || []).includes(option)} onChange={() => toggleComfort(option)} /><span>{option}</span></label>)}</div>
        <label className="survey-field">Other<input maxLength={300} value={answers.comfortOther || ''} onChange={e => update('comfortOther', e.target.value)} placeholder="Anything else that would build trust?" /></label>
        <label className="survey-field">Any other feedback? <small>(optional)</small><textarea maxLength={1000} rows={4} value={answers.feedback || ''} onChange={e => update('feedback', e.target.value)} placeholder="Tell us what matters to you. Please leave out ID numbers and private document details." /></label>
      </section>
      <section className="survey-contact"><h2>Keep in touch <small>(optional)</small></h2><p>If you selected testing, volunteering or collection-partner interest, leave a phone number or email so the Back 2 Owner team can follow up.</p><label className="survey-field">Phone number or email<input maxLength={120} autoComplete="off" value={answers.contact || ''} onChange={e => update('contact', e.target.value)} /></label><label className="survey-consent"><input type="checkbox" required={Boolean(answers.contact?.trim())} checked={answers.contactConsent || false} onChange={e => update('contactConsent', e.target.checked)} /><span>The respondent explicitly agreed that the Back 2 Owner team may contact them about testing, volunteering or partnering. Read this permission request aloud before ticking.</span></label></section>
      <p className="survey-note">We use your answers to improve Back 2 Owner and plan the community pilot. Only authorised administrators can review responses. Do not include ID numbers, document copies or passwords.</p>
      {error && <p role="alert" className="survey-error">{error} Your answers are still here. Please try again.</p>}
      <button className="btn survey-submit" type="submit" disabled={busy}>{busy ? 'Saving your feedback…' : 'Save respondent’s feedback'}</button>
    </form>}
    <footer className="survey-footer">Back 2 Owner · Lost property, responsibly returned</footer>
  </main>
}
