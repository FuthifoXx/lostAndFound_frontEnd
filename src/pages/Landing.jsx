import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRoleHome } from '../utils/getRoleHome'

function Landing() {
  const { user } = useAuth()

  return (
    <div className='public-page'>
      <Navbar />

      <main>
        <section className='landing-hero'>
          <div className='landing-hero-copy'>
            <p className='landing-eyebrow'>Lost property, responsibly returned</p>
            <h1>Helping lost items find their way back home.</h1>
            <p className='landing-intro'>
              Back 2 Owner connects people with verified lost property through
              trusted collection partners—without exposing private contact details.
            </p>

            <div className='landing-actions'>
              <Link to='/items' className='btn'>Browse found items</Link>
              {user ? (
                <Link to={getRoleHome(user.role)} className='btn btn-hipster'>
                  Go to dashboard
                </Link>
              ) : (
                <Link to='/register' className='btn btn-hipster'>Create account</Link>
              )}
            </div>

            <p className='landing-trust'>
              Secure claims <span aria-hidden='true'>•</span> Verified collection
              <span aria-hidden='true'> • </span> Protected personal information
            </p>
          </div>

          <div className='landing-journey' aria-label='How Back 2 Owner works'>
            <div className='journey-heading'>
              <span>How it works</span>
              <strong>Three simple steps</strong>
            </div>
            <ol className='journey-steps'>
              <li>
                <span className='journey-number'>1</span>
                <div><strong>Browse</strong><p>Search approved items safely.</p></div>
              </li>
              <li>
                <span className='journey-number'>2</span>
                <div><strong>Claim</strong><p>Submit ownership details for review.</p></div>
              </li>
              <li>
                <span className='journey-number'>3</span>
                <div><strong>Collect</strong><p>Collect from the verified partner location.</p></div>
              </li>
            </ol>
          </div>
        </section>

        <section className='landing-purpose' aria-labelledby='landing-purpose-title'>
          <div>
            <p className='landing-eyebrow'>Found something?</p>
            <h2 id='landing-purpose-title'>Hand it in. Help it get home.</h2>
          </div>
          <p>
            Take found property to an affiliated Back 2 Owner partner. Staff will
            record it securely and manage the return process.
          </p>
        </section>
      </main>
    </div>
  )
}

export default Landing
