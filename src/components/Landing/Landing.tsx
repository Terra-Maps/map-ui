import React from "react";
import { Link, useHistory } from "react-router-dom";
import { FaSpaceShuttle, FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import "./Landing.scss";

function Landing() {
  const history = useHistory();
  return (
    <div className="Landing">
      <div className="top-background-container">
        <div className="gradient-layer"></div>
        <img
          src={require("../../assets/ss/bcg.jpg")}
          alt="bcg"
          className="background-image"
        />
      </div>
      <div className="landing-header">
        <header className="RootHeader">
          <div className="header-container">
            <div className="navbar-container">
              <div className="logo-container">
                <div className="app-logo-container">
                  <Link to="/">
                    <img
                      src={require("../../assets/png/terralogo.png")}
                      alt="logo"
                      className="logo-image"
                      height={64}
                      loading="lazy"
                    />
                    <span className="logo-badge">Alpha</span>
                  </Link>
                </div>
              </div>
              <div className="user-profile-container">
                <a
                  className={`login-container`}
                  href="https://discord.gg/MB7G7KaJ6w"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact
                </a>
                <a
                  className={`login-container`}
                  href="https://drive.google.com/file/d/1NveDpAMgyx_6juGGffGLJ4qG9glw1VNX/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Whitepaper
                </a>
                <button
                  type="button"
                  className="primary-button"
                  onClick={(e) => history.push("/map")}
                >
                  Start Mapping
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>
      <div className="landing-home">
        <div className="landing-home-body">
          <h1>Introducing TerraMaps</h1>
          <h1 className="heading-sec">
            An Open Protocol For Decentralized, Geospatial Data
          </h1>
          <button
            type="button"
            className="primary-button"
            onClick={(e) => history.push("/map")}
          >
            <span className="button-icon">
              <FaSpaceShuttle />
            </span>
            <span>Start Exploring</span>
          </button>
          <div className="alpha-text">Alpha release now available</div>
        </div>
        <div className="landing-home-screenshot-container">
          <img
            src={require("../../assets/ss/ss1.png")}
            alt="ss"
            loading="lazy"
            className="landing-home-screenshot"
          />
        </div>
      </div>
      <div className="landing-solution">
        <div className="landing-solution-container">
          <div className="landing-solution-title">Our Solution</div>
          <div className="landing-solution-list">
            <div className="landing-solution-item">
              <img
                src={require("../../assets/png/map_1.png")}
                alt="logo"
                className="card-image"
                height={64}
                loading="lazy"
              />
              <h3>Collaborative Verified Map.</h3>
              <p>
                TerraMaps provide more resilient alternatives to centralized
                maps by employing collaborative verification of map data.
              </p>
            </div>
            <div className="landing-solution-item">
              <img
                src={require("../../assets/png/blockchain.png")}
                alt="logo"
                className="card-image"
                height={64}
                loading="lazy"
              />
              <h3>Built on blockchain.</h3>
              <p>
                TerraMaps is built on the Algorand blockchain, a decentralized
                and scalable database that is secure without a third party or
                gatekeeper.
              </p>
            </div>
            <div className="landing-solution-item">
              <img
                src={require("../../assets/png/money.png")}
                alt="logo"
                className="card-image"
                height={64}
                loading="lazy"
              />
              <h3>Incentive for verification.</h3>
              <p>
                TerraMaps adds a monetization and token incentive layer to open
                source mapping to make it more trustworthy and motivate
                participants.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="landing-usecase">
        <div className="landing-usecase-container">
          <div className="landing-usecase-title">A Field of Applications</div>
          <div className="landing-usecase-desc-text">
            Verified location data benefits a wide range of use-cases.
          </div>
          <div className="landing-usecase-list">
            <div className="landing-usecase-item">
              <img
                src={require("../../assets/png/cloud-computing.png")}
                alt="logo"
                className="card-image"
                height={64}
                loading="lazy"
                color={"white"}
              />
              <h3>Internet of Things</h3>
              <p>
                Secure location verification and localization for networks of
                IoT devices.
              </p>
            </div>
            <div className="landing-usecase-item">
              <img
                src={require("../../assets/png/placeholder.png")}
                alt="logo"
                className="card-image"
                height={64}
                loading="lazy"
              />
              <h3>Geospatial Data</h3>
              <p>
                Data provenance and attribution to support the development of
                decentralized data-markets.
              </p>
            </div>
            <div className="landing-usecase-item">
              <img
                src={require("../../assets/png/supply-chain.png")}
                alt="logo"
                className="card-image"
                height={64}
                loading="lazy"
              />
              <h3>Supply Chain</h3>
              <p>
                Verifiable and precise product tracking from supplier to
                customer, with all the steps in-between.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="landing-footer">
        <div className="landing-footer-container">
          <div className="landing-solution-title">TRM Tokenomics</div>
          <div className="total-supply-title">
            TOTAL SUPPLY - 100,000,000 TRM
          </div>
          <img
            src={require("../../assets/png/tokenomics.png")}
            alt="logo"
            className="tokenomics-image"
            height={64}
            loading="lazy"
          />
        </div>
      </div>
      <div className="landing-roadmap">
        <div className="landing-roadmap-container">
          <div className="landing-roadmap-title">Roadmap</div>
          <div className="landing-roadmap-title2">Coming Soon</div>
        </div>
      </div>
      <div className="landing-powered">
        <div className="landing-powered-container">
          <div className="landing-powered-title">Powered By</div>
          <div className="landing-powered-title2">Terra Maps is Built on</div>
        </div>
        <div className="landing-powered-logos">
            <div className="app-logo-container">
              <Link to="/">
                <img
                  src={require("../../assets/png/binance.png")}
                  alt="logo"
                  className="logo-image"
                  height={92}
                  width={92}
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="app-logo-container">
              <Link to="/">
                <img
                  src={require("../../assets/png/matic_network.png")}
                  alt="logo"
                  className="logo-image"
                  height={92}
                  width={92}
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="app-logo-container">
              <Link to="/">
                <img
                  src={require("../../assets/png/algorand.png")}
                  alt="logo"
                  className="logo-image"
                  height={92}
                  width={92}
                  loading="lazy"
                />
              </Link>
            </div>
          </div>
        
      </div>
      <div className="landing-roadmap">
        <div className="landing-roadmap-container">
          <div className="landing-roadmap-title">Subscribe for Latest Updates</div>
        </div>
        <iframe style={{border: "none"}} src="https://terramaps.substack.com/embed" width="480" height="320" scrolling="no" />
      </div>
      <div className="landing-footer">
        <div className="landing-footer-container">
          <div className="app-logo-container">
            <Link to="/">
              <img
                src={require("../../assets/png/terralogo.png")}
                alt="logo"
                className="logo-image"
                height={92}
                width={92}
                loading="lazy"
              />
            </Link>
          </div>
          <div className="landing-footer-social-icon-container">
            <div
              className="landing-footer-social-icon"
              onClick={(e) =>
                window.open(
                  "https://github.com/Terra-Maps",
                  "_blank",
                  "noopener"
                )
              }
            >
              <FaGithub />
            </div>
            <div
              className="landing-footer-social-icon"
              onClick={(e) =>
                window.open(
                  "https://discord.gg/MB7G7KaJ6w",
                  "_blank",
                  "noopener"
                )
              }
            >
              <FaDiscord />
            </div>
            <div
              className="landing-footer-social-icon"
              onClick={(e) =>
                window.open(
                  "https://twitter.com/argoapplive",
                  "_blank",
                  "noopener"
                )
              }
            >
              <FaTwitter />
            </div>
          </div>
          <div className="landing-footer-texts">
            <a
              href="https://www.terramaps.space/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built on BSC
            </a>{" "}
            •{" "}
            <a
              href="https://www.terramaps.space/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Use
            </a>{" "}
            •{" "}
            <a
              href="https://www.terramaps.space/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </div>
          <div className="landing-footer-texts">© 2020 TerraMaps</div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
