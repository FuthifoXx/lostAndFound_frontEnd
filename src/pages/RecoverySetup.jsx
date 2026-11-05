import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getMe,
  requestEmailConfirmation,
  saveRecoveryProfile,
  getPossibleMatches,
  getLossReports,
  createLossReport,
} from '../services/api'
import PageHeader from '../components/PageHeader'

const initial = {
  mode: 'possible',
  identityType: 'RSA_ID',
  firstNames: '',
  surname: '',
  dateOfBirth: '',
  idNumber: '',
  passportNumber: '',
  documentNumber: '',
  consent: false,
}
export default function RecoverySetup() {
  const [profile, setProfile] = useState(null),
    [form, setForm] = useState(initial),
    [items, setItems] = useState([]),
    [reports, setReports] = useState([])
  const [report, setReport] = useState({
    itemType: '',
    area: '',
    dateLost: '',
    details: '',
  })
  const [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true)
  const refresh = async () => {
    const [user, candidates, losses] = await Promise.all([
      getMe(),
      getPossibleMatches(),
      getLossReports(),
    ])
    setProfile(user)
    setItems(candidates.items)
    setReports(losses)
    setForm((current) => ({
      ...current,
      mode: user.exactMatching ? 'exact' : 'possible',
      identityType: user.identityType || 'RSA_ID',
      firstNames: (user.firstNames || []).join(' '),
      surname: user.surname || '',
      dateOfBirth: user.dateOfBirth?.slice(0, 10) || '',
    }))
  }
  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const [user, candidates, losses] = await Promise.all([
          getMe(),
          getPossibleMatches(),
          getLossReports(),
        ])
        if (!active) return
        setProfile(user)
        setItems(candidates.items)
        setReports(losses)
        setForm({
          ...initial,
          mode: user.exactMatching ? 'exact' : 'possible',
          identityType: user.identityType || 'RSA_ID',
          firstNames: (user.firstNames || []).join(' '),
          surname: user.surname || '',
          dateOfBirth: user.dateOfBirth?.slice(0, 10) || '',
        })
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])
  const action = async (task) => {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await task()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const change = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    })
  const save = (e) => {
    e.preventDefault()
    action(async () => {
      const result = await saveRecoveryProfile(form)
      setForm((current) => ({
        ...current,
        idNumber: '',
        passportNumber: '',
        documentNumber: '',
        consent: false,
      }))
      await refresh()
      setMessage(result.message)
    })
  }
  const saveReport = (e) => {
    e.preventDefault()
    action(async () => {
      await createLossReport(report)
      setReport({ itemType: '', area: '', dateLost: '', details: '' })
      setReports(await getLossReports())
      setMessage(
        'Private loss report saved. It does not create a public listing or automatically identify an owner.',
      )
    })
  }
  const numberField = {
    RSA_ID: 'idNumber',
    PASSPORT: 'passportNumber',
    OTHER: 'documentNumber',
  }[form.identityType]
  if (loading)
    return (
      <div className="dashboard-loading" role="status">
        Loading your recovery options…
      </div>
    )
  return (
    <div className="recovery-setup-page">
      <PageHeader
        title="Recovery setup"
        description="Choose what to share, understand how matching works, and keep track of what you have lost."
      />
      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="alert alert-success" role="status">
          {message}
        </p>
      )}
      {!profile ? (
        <Link to="/login">Sign in again</Link>
      ) : (
        <>
          <section className="recovery-panel" aria-labelledby="recovery-status">
            <h2 id="recovery-status">Your setup</h2>
            <p>
              <strong>Email:</strong>{' '}
              {profile.emailConfirmed ? 'Confirmed' : 'Not confirmed'} ·{' '}
              <strong>Matching:</strong>{' '}
              {profile.exactMatching
                ? 'Exact document details supplied'
                : profile.candidateMatching
                  ? 'Possible matching enabled'
                  : 'Not enabled'}
            </p>
            <p>
              Matching details are self-supplied. A collection partner still
              checks ownership before handing over an item.
            </p>
            {!profile.emailConfirmed && (
              <>
                <p>
                  Check your inbox for the confirmation link sent when you
                  registered. You can still keep a private loss report below.
                </p>
                <div className="recovery-actions">
                  <button
                    className="btn"
                    disabled={busy}
                    onClick={() =>
                      action(async () =>
                        setMessage((await requestEmailConfirmation()).message),
                      )
                    }
                  >
                    Request confirmation email
                  </button>
                  <button
                    className="btn btn-hipster"
                    disabled={busy}
                    onClick={() => action(refresh)}
                  >
                    I’ve confirmed my email — refresh
                  </button>
                </div>
              </>
            )}
            <Link to="/dashboard">View my matched items and claims</Link>
          </section>
          <form className="recovery-panel" onSubmit={save}>
            <h2>Enable private document matching</h2>
            <p>
              This step is optional. Document names and DOB help find possible
              candidates. A full document number enables exact matching. Neither
              method proves ownership by itself.
            </p>
            <fieldset disabled={busy || !profile.emailConfirmed}>
              <legend>Matching preferences</legend>
              <div className="recovery-grid">
                <div className="form-row">
                  <label className="form-label" htmlFor="matching-mode">
                    Matching method
                  </label>
                  <select
                    id="matching-mode"
                    name="mode"
                    className="form-input"
                    value={form.mode}
                    onChange={change}
                  >
                    <option value="possible">Names and DOB (possible)</option>
                    <option value="exact">Document number (exact)</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="matching-document">
                    Document type
                  </label>
                  <select
                    id="matching-document"
                    name="identityType"
                    className="form-input"
                    value={form.identityType}
                    onChange={change}
                  >
                    <option value="RSA_ID">RSA ID</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="OTHER">Other document</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="matching-names">
                    First names as recorded on the document
                  </label>
                  <input
                    id="matching-names"
                    className="form-input"
                    name="firstNames"
                    value={form.firstNames}
                    onChange={change}
                    maxLength={120}
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="matching-surname">
                    Surname as recorded on the document
                  </label>
                  <input
                    id="matching-surname"
                    className="form-input"
                    name="surname"
                    value={form.surname}
                    onChange={change}
                    maxLength={120}
                    autoComplete="family-name"
                    required
                  />
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="matching-dob">
                    Date of birth {form.mode === 'exact' ? '(optional)' : ''}
                  </label>
                  <input
                    id="matching-dob"
                    type="date"
                    className="form-input"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={change}
                    autoComplete="bday"
                    required={form.mode === 'possible'}
                  />
                </div>
                {form.mode === 'exact' && (
                  <div className="form-row">
                    <label className="form-label" htmlFor="matching-number">
                      {form.identityType === 'RSA_ID'
                        ? 'RSA ID number'
                        : form.identityType === 'PASSPORT'
                          ? 'Passport number'
                          : 'Document number'}
                    </label>
                    <input
                      id="matching-number"
                      className="form-input"
                      name={numberField}
                      value={form[numberField]}
                      onChange={change}
                      inputMode={
                        form.identityType === 'RSA_ID' ? 'numeric' : 'text'
                      }
                      maxLength={80}
                      autoComplete="off"
                      required
                    />
                    <small>
                      Used privately for matching. Your number is not displayed
                      in public listings.
                    </small>
                  </div>
                )}
              </div>
              <label className="matching-consent">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={change}
                  required
                />{' '}
                I choose to use these details for private recovery matching. I
                understand a possible match is not proof of ownership.
              </label>
              <button className="btn" disabled={busy}>
                {busy ? 'Saving…' : 'Save matching preferences'}
              </button>
            </fieldset>
            {profile.exactMatching && (
              <p>
                Your existing exact matching remains active. Contact Back 2
                Owner if you need to change your registered document.
              </p>
            )}
          </form>
          <section
            className="recovery-panel"
            aria-labelledby="possible-heading"
          >
            <h2 id="possible-heading">Possible matches</h2>
            <p>
              Check this page for new possible matches. Only approved, available
              documents with recorded names and DOB can appear. A person with
              similar details could also be a candidate.
            </p>
            {items.length ? (
              items.map((item) => (
                <div className="possible-match" key={item.reference}>
                  <strong>Possible {item.documentType} match</strong>
                  <p>
                    We have not confirmed this belongs to you. No document photo
                    or identity number is revealed here.
                  </p>
                  <button
                    className="btn btn-hipster"
                    disabled={busy}
                    onClick={() =>
                      setForm({ ...form, mode: 'exact', consent: false })
                    }
                  >
                    Use exact matching to check privately
                  </button>
                </div>
              ))
            ) : (
              <p>
                No possible matches to show. You can enable matching above or
                check again later.
              </p>
            )}
            <button
              className="btn btn-hipster"
              disabled={busy}
              onClick={() => action(refresh)}
            >
              Check again
            </button>
          </section>
          <form className="recovery-panel" onSubmit={saveReport}>
            <h2>Keep a private lost-item report</h2>
            <p>
              This note is visible only in your account. Do not enter ID
              numbers, bank details or document images. The report does not
              submit an ownership claim.
            </p>
            <div className="recovery-grid">
              {[
                ['itemType', 'Item type', 'text', 80],
                ['area', 'Area lost (optional)', 'text', 120],
                ['dateLost', 'Date lost (optional)', 'date', undefined],
              ].map(([name, label, type, max]) => (
                <div className="form-row" key={name}>
                  <label className="form-label" htmlFor={'report-' + name}>
                    {label}
                  </label>
                  <input
                    id={'report-' + name}
                    className="form-input"
                    type={type}
                    value={report[name]}
                    maxLength={max}
                    required={name === 'itemType'}
                    onChange={(e) =>
                      setReport({ ...report, [name]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="report-details">
                Brief description (optional)
              </label>
              <textarea
                id="report-details"
                className="form-input"
                value={report.details}
                maxLength={500}
                onChange={(e) =>
                  setReport({ ...report, details: e.target.value })
                }
              />
            </div>
            <button className="btn" disabled={busy}>
              {busy ? 'Saving…' : 'Save private report'}
            </button>
            <ul className="private-report-list">
              {reports.map((item) => (
                <li key={item._id}>
                  <strong>{item.itemType}</strong>
                  {item.area ? ' · ' + item.area : ''}
                  {item.dateLost ? ' · ' + item.dateLost.slice(0, 10) : ''}
                  <p>{item.details}</p>
                </li>
              ))}
            </ul>
          </form>
        </>
      )}
    </div>
  )
}
