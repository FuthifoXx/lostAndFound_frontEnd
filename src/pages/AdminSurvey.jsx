import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
export default function AdminSurvey() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    setData(null); setError('')
    apiRequest(`/surveys?page=${page}`).then(value => { if (active) setData(value) }).catch(err => { if (active) setError(err.message) })
    return () => { active = false }
  }, [page])
  return <section className="survey-shell survey-responses"><h1>Community feedback</h1><p>Responses from the Back 2 Owner survey.</p><Link className="btn" to="/admin/survey/new">Conduct Survey</Link>{error && <p role="alert">{error}</p>}{!data && !error && <p role="status">Loading responses…</p>}{data && <><p>{data.total} responses · Page {page}</p>{data.responses.length === 0 && <p>No responses yet. Select Conduct Survey to record your first interview.</p>}{data.responses.map(row => <article className="survey-card" key={row._id} style={{ marginBottom: 20 }}><p>{new Date(row.createdAt).toLocaleDateString()}</p><dl>{[['Seen a lost and found app before', 'seenAppBefore'], ['Earlier survey: experience', 'experience'], ['Lost item', 'lostItem'], ['Recovered', 'recovered'], ['Recovery method', 'recoveryMethod'], ['Queues (1–10)', 'queueRating'], ['Help desk information (1–10)', 'helpDeskRating'], ['Customer service (1–10)', 'customerServiceRating'], ['Replacement fee fair', 'replacementFeeFair'], ['Would subscribe', 'subscribe'], ['Willing to pay (R)', 'willingToPay'], ['Lost an item before', 'lostBefore'], ['Usefulness', 'usefulness'], ['Would recommend', 'recommend'], ['Interest', 'interest'], ['Ease of use', 'ease'], ['Comfort factors', 'comfortFactors'], ['Other comfort factor', 'comfortOther'], ['Keep in touch', 'keepInTouch'], ['Research consent', 'researchConsent'], ['Earlier feedback', 'feedback'], ['Contact (consented)', 'contact']].map(([label, key]) => row[key] && <div key={key}><dt><strong>{label}</strong></dt><dd style={{ margin: '4px 0 16px', overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{Array.isArray(row[key]) ? row[key].join(', ') : typeof row[key] === 'boolean' ? (row[key] ? 'Agreed' : 'Not agreed') : row[key]}</dd></div>)}</dl></article>)}<div className="landing-actions"><button className="btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button><button className="btn" disabled={page >= data.pages} onClick={() => setPage(p => p + 1)}>Next</button></div></>}</section>
}
