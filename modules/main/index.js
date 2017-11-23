import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import Media from "react-media"
import "./styles.css"

class CSSAnimation extends React.Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    mountedClassName: PropTypes.string
  }

  static defaultProps = {
    mountedClassName: "mounted"
  }

  state = {
    mounted: false
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ mounted: true })
    }, 100)
  }

  render() {
    const { className, mountedClassName, ...props } = this.props

    let c = className
    if (this.state.mounted) c += ` ${mountedClassName}`

    return <div {...props} className={c} />
  }
}

class App extends React.Component {
  render() {
    return (
      <CSSAnimation
        className="fade-in"
        style={{ display: "flex", alignItems: "center", height: "100%" }}
      >
        <Media
          query={{ minWidth: 400 }}
          children={matches => (
            <div
              style={{
                width: "100%",
                maxWidth: 460,
                paddingLeft: matches ? 100 : 20,
                paddingRight: matches ? 30 : 20
              }}
            >
              <p>Hi there.</p>
              <p>
                My name is Michael Jackson. I'm a software engineer and
                co-founder of{" "}
                <a href="https://reacttraining.com">React Training</a>.
              </p>
              <p>
                I write code <a href="https://github.com/mjackson">on GitHub</a>{" "}
                and occasionally share my thoughts{" "}
                <a href="https://medium.com/@mjackson">on Medium</a>. I also
                give{" "}
                <a href="https://www.youtube.com/playlist?list=PLpMF67G_F_CZWMRVan_F3p6d_Rv5g-Pij">
                  lots of talks
                </a>, mostly about <a href="https://reactjs.org">React</a>.
              </p>
              <p>
                Some of my best-known creations are{" "}
                <a href="https://unpkg.com">unpkg</a>,{" "}
                <a href="https://github.com/ReactTraining/react-router">
                  react-router
                </a>,{" "}
                <a href="https://github.com/ReactTraining/history">history</a>,
                and{" "}
                <a href="https://github.com/janl/mustache.js">mustache.js</a>.
              </p>
              <p>
                You should follow me on{" "}
                <a href="https://twitter.com/mjackson">Twitter</a>. You can see
                my work history on{" "}
                <a href="https://www.linkedin.com/in/mjijackson/">LinkedIn</a>.
              </p>
              <p>Thanks for stopping by! 😅</p>
              <p>&nbsp;</p>
              <p>
                Michael Jackson<br />
                <a href="mailto:mj@mjackson.me">mj@mjackson.me</a>
                <br />
                <a href="https://twitter.com/mjackson">@mjackson</a>
              </p>
            </div>
          )}
        />
      </CSSAnimation>
    )
  }
}

ReactDOM.render(<App />, document.body)
