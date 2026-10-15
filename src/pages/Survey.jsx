import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import '../styles/survey.css'

const questions = [
  ['seenAppBefore', 'Have you ever used or come across a lost-and-found app or service before?', ['Yes', 'No']],
  ['lostBefore', 'Have you ever lost an important document or personal item?', ['Yes', 'No']],
  ['recovered', 'Were you able to recover the lost item or document?', ['Yes', 'No']],
  ['ratings', 'How would you rate your experience with services such as Home Affairs, Licensing Departments, or other public service offices when replacing or obtaining documents?'],
  ['replacementFeeFair', 'Do you think the fees charged to replace lost documents are fair and reasonable?', ['Yes', 'No', 'Not sure']],
  ['usefulness', 'How useful would a lost-document recovery service be in your community?', ['Very useful', 'Somewhat useful', 'Not useful', 'Not sure yet']],
  ['recommend', 'Would you recommend a service like Back 2 Owner to someone else?', ['Yes', 'Maybe', 'No']],
  ['subscribe', 'Would you subscribe to a service that helps people recover lost documents and personal items?', ['Yes', 'Maybe', 'No']],
  ['willingToPay', 'If Back 2 Owner successfully helped recover an important document or item for you, how much would you consider reasonable to pay for the recovery service?'],
  ['interest', 'Would you like to become involved with Back 2 Owner?', ['Just sharing feedback', 'Help test the app', 'Volunteer in my community', 'Explore becoming a collection partner']],
]
const ratings = [['queueRating', 'Time spent waiting in queues'], ['helpDeskRating', 'Information provided at the help desk'], ['customerServiceRating', 'Level of customer service']]
const comfortOptions = ['Strong privacy protection', 'Trusted local collection partners', 'Clear owner-verification process', 'Community/SAPS awareness', 'Reviews from other users', 'Clear explanation of how my information is used', 'Other']
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
      <h1>Back 2 Owner — Community Survey</h1>
      <p>Ask each question and record the respondent’s answers. Read the introduction and privacy note to them before starting. Participation is voluntary.</p>
      <div className="survey-tags"><span>About 5 minutes</span><span>Admin-led interview</span><span>Contact details optional</span></div>
    </header>
    {done ? <section className="survey-card survey-thanks" role="status"><span className="survey-check" aria-hidden="true">✓</span><h2>Thank you for having your say.</h2><p>Your response has been saved. You are helping us build a service that works for our community.</p><button className="btn" type="button" onClick={() => { setAnswers({}); setError(''); setDone(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Next respondent</button><Link to="/admin/survey">View survey responses</Link></section> : <form className="survey-card" onSubmit={submit}>
      <aside className="survey-explainer"><strong>New to Back 2 Owner?</strong><p>Found items are recorded by collection partners and reviewed by an administrator. Owners can browse, submit a claim and collect after verification. Matching identity details can also help notify an owner.</p><Link to="/" target="_blank" rel="noreferrer">Explore the app in a new tab ↗</Link></aside>
      <p className="survey-note">Read to the respondent: Taking part is voluntary. We use your answers to improve Back 2 Owner and plan the community pilot. You can skip the interview or stop at any time. Contact details are optional. Complete the applicable questions to save a response. Skip question 3 if no item was lost. Service ratings are optional if the respondent has no experience of these departments.</p>
      <section className="survey-contact"><h2>Respondent details <small>(optional)</small></h2><p className="survey-note">You may leave these blank. Contact details are saved only if you choose Yes to keeping in touch below.</p><label className="survey-field">First name(s)<input maxLength={100} autoComplete="off" value={answers.firstNames || ''} onChange={e => update('firstNames', e.target.value)} /></label><label className="survey-field">Surname<input maxLength={100} autoComplete="off" value={answers.surname || ''} onChange={e => update('surname', e.target.value)} /></label><label className="survey-field">Phone number or email<input maxLength={120} autoComplete="off" required={answers.keepInTouch === 'Yes'} value={answers.contact || ''} onChange={e => update('contact', e.target.value)} /></label></section>
      {questions.map(([key, label, options], index) => <fieldset key={key} disabled={key === 'recovered' && answers.lostBefore !== 'Yes'}><legend><span className="survey-number">{index + 1}</span>{label}</legend>
        {key === 'recovered' && answers.lostBefore !== 'Yes' ? <p className="survey-note">Not applicable unless the respondent answered Yes to question 2.</p> : options ? <div className="survey-options">{options.map(option => <label className="survey-choice" key={option}><input type="radio" name={key} value={option} required checked={answers[key] === option} onChange={e => update(key, e.target.value)} /><span>{option}</span></label>)}</div> : key === 'ratings' ? <><p className="survey-note">1 = Poor · 10 = Excellent. Leave blank if not applicable.</p>{ratings.map(([field, text]) => <label className="survey-field" key={field}>{text}<select value={answers[field] || ''} onChange={e => update(field, e.target.value)}><option value="">Not applicable / no experience</option>{Array.from({ length: 10 }, (_, i) => <option value={i + 1} key={i}>{i + 1}</option>)}</select></label>)}</> : <label className="survey-field">Amount in rand (R)<small>Suggested range: R20–R100</small><input type="number" min="0" step="0.01" required value={answers.willingToPay || ''} onChange={e => update('willingToPay', e.target.value)} /></label>}
        {key === 'lostBefore' && answers.lostBefore === 'Yes' && <label className="survey-field">What was it?<input maxLength={300} required value={answers.lostItem || ''} onChange={e => update('lostItem', e.target.value)} /></label>}
        {key === 'recovered' && answers.lostBefore === 'Yes' && answers.recovered === 'Yes' && <label className="survey-field">How did you recover it?<input maxLength={500} required value={answers.recoveryMethod || ''} onChange={e => update('recoveryMethod', e.target.value)} /></label>}
      </fieldset>)}
      <fieldset><legend>What would make you more comfortable using a lost-and-found recovery service?</legend><p className="survey-note">Select all that apply (optional).</p><div className="survey-options">{comfortOptions.map(option => <label className="survey-choice" key={option}><input type="checkbox" checked={(answers.comfortFactors || []).includes(option)} onChange={e => update('comfortFactors', e.target.checked ? [...(answers.comfortFactors || []), option] : (answers.comfortFactors || []).filter(value => value !== option))} /><span>{option}</span></label>)}</div>{answers.comfortFactors?.includes('Other') && <label className="survey-field">Other<input maxLength={1000} required value={answers.comfortOther || ''} onChange={e => update('comfortOther', e.target.value)} /></label>}</fieldset>
      <section className="survey-contact"><fieldset><legend>Would you like us to keep in touch with you about the Back 2 Owner pilot?</legend><div className="survey-options">{['Yes', 'No'].map(value => <label className="survey-choice" key={value}><input type="radio" name="keepInTouch" required checked={answers.keepInTouch === value} onChange={() => setAnswers(a => ({ ...a, keepInTouch: value, contact: value === 'No' ? '' : a.contact || '' }))} /><span>{value}</span></label>)}</div></fieldset>{answers.keepInTouch === 'Yes' && <p className="survey-note">Please provide a phone number or email in Respondent details above.</p>}</section>
      <section><h2>Consent</h2><p className="survey-note">Read this statement to the respondent and tick only after they agree.</p><label className="survey-consent"><input type="checkbox" required checked={answers.researchConsent || false} onChange={e => update('researchConsent', e.target.checked)} /><span>I agree that Back 2 Owner may use the information I provide in this survey for research, pilot testing, and improving the Back 2 Owner service. I understand that participation is voluntary and that my contact details will only be used to contact me about Back 2 Owner where I have agreed to be contacted.</span></label></section>
      <p className="survey-note">We use your answers to improve Back 2 Owner and plan the community pilot. Only authorised administrators can review responses. Do not include ID numbers, document copies or passwords.</p>
      {error && <p role="alert" className="survey-error">{error} Your answers are still here. Please try again.</p>}
      <button className="btn survey-submit" type="submit" disabled={busy}>{busy ? 'Saving your feedback…' : 'Save respondent’s feedback'}</button>
    </form>}
    <footer className="survey-footer">Back 2 Owner · Lost property, responsibly returned</footer>
  </main>
}
