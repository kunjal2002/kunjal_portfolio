import React from "react";
import "./App.css";
// Load Vercel Analytics dynamically only when enabled via env var
import ClickSpark from "./ClickSpark";

import { useEffect, useState } from 'react';

// Move intro lines out of the component to avoid useEffect dependency warnings
const INTROS = [
  "Engineer fluent in Java, Python, and turning ideas into scalable systems.",
  "Bridging front-end elegance with back-end resilience.",
  "AI explorer by day, data whisperer by night — driven by impact.",
  "Obsessed with clean code, clever abstractions, and caffeine-powered debugging.",
  "From RESTful APIs to regression models — I architect, optimize, and deliver.",
  "Enjoy having conversations over tea/coffee:)"
];

const useGoogleAnalytics = () => {
  useEffect(() => {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-RTTS0WDPYV';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-RTTS0WDPYV');
    `;
    document.head.appendChild(script2);
  }, []);
};

const App = () => {
  useGoogleAnalytics();

  useEffect(() => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector("nav ul");

    const toggleMenu = () => {
      navLinks?.classList.toggle("active");
      hamburger?.classList.toggle("active");
    };

    const closeMenu = () => {
      navLinks?.classList.remove("active");
      hamburger?.classList.remove("active");
    };

    hamburger?.addEventListener("click", toggleMenu);

    document.querySelectorAll("nav ul li a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    return () => {
      hamburger?.removeEventListener("click", toggleMenu);
      document.querySelectorAll("nav ul li a").forEach(link => {
        link.removeEventListener("click", closeMenu);
      });
    };
  }, []);


  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [AnalyticsComp, setAnalyticsComp] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Enable by setting REACT_APP_ENABLE_VERCEL_ANALYTICS=true in environment (only on deployments where the script is available)
    try {
      const enabled = process.env.REACT_APP_ENABLE_VERCEL_ANALYTICS === 'true';
      if (!enabled) return;
    } catch (err) {
      return;
    }

    let mounted = true;
    import('@vercel/analytics/react')
      .then((mod) => {
        if (mounted && mod && mod.Analytics) setAnalyticsComp(() => mod.Analytics);
      })
      .catch(() => {
        // ignore import errors — avoid noisy 404s when the script isn't available
      });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // use INTROS defined at module scope (refer to INTROS directly)

  const TYPING_SPEED = 51;   // ms per character
  const PAUSE_AFTER_TYPING = 1100;  // ms to wait after typing full sentence
  const DELETING_SPEED = 10; // ms per character deleting
  const PAUSE_AFTER_DELETING = 500; // ms to wait before typing next

  const [bioIndex, setBioIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayedText === INTROS[bioIndex]) {
      // Wait after finishing typing
      timer = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPING);
    } else if (isDeleting && displayedText === "") {
      // Wait after deleting then move to next intro
      timer = setTimeout(() => {
        setIsDeleting(false);
        setBioIndex((prev) => (prev + 1) % INTROS.length);
      }, PAUSE_AFTER_DELETING);
    } else {
      // Continue typing or deleting
      timer = setTimeout(() => {
        const fullText = INTROS[bioIndex];
        if (isDeleting) {
          setDisplayedText(fullText.substring(0, displayedText.length - 1));
        } else {
          setDisplayedText(fullText.substring(0, displayedText.length + 1));
        }
      }, isDeleting ? DELETING_SPEED : TYPING_SPEED);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, bioIndex]);

  return (
    <ClickSpark sparkColor='#007bff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <div className="main">
        {showScrollBtn && (
          <button
            onClick={() => {
              scrollToTop();
            }}
            id="myBtn"
            title="Go to top"
            style={{ backgroundColor: "transparent" }}
          >
            <img
              src="/images/blue_upward_arrow-removebg-preview.png"
              style={{ width: "100%", height: "40px" }}
              alt="Back to top"
            />
          </button>)}

        <header className="home" id="home">
          <nav id="navbar">
            <ul className="nav-links">
              <li><a href="#home">HOME</a></li>
              <li><a href="#education-title">EDUCATION</a></li>
              <li><a href="#work-experience-title">WORK EXPERIENCE</a></li>
              <li><a href="#project-title">PROJECTS</a></li>
              <li><a href="#skills">SKILLS</a></li>
              <li><a href="#extracurriculars">EXTRACURRICULARS</a></li>
              <li><a href="#site-footer">CONTACT</a></li>
            </ul>
            <button className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>

          <img
            src="/images/background.JPG"
            className="background-picture"
            style={{ width: "100%" }}
            alt="Background"
          />

          <div className="my-info">
            <div className="profile_picture">
              <img
                src="/images/professional_2_4x5_image.JPG"
                alt="Kunjal's Profile"
                className="responsive"
              />
            </div>

            <div className="content">
              <h1 style={{ fontSize: "33px", lineHeight: "29px" }}>
                Software Engineer and Data Enthusiast
              </h1>
              <br />
              <div
                className="tech-identity-container"
                style={{
                  maxWidth: 1001,
                  // padding: "1rem",
                  borderRadius: "0.75rem",
                  // backgroundColor: "#f3f4f6",
                  // boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "white", // Tailwind gray-700
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  // borderRight: "3px solid #2563eb", // blue cursor
                  animation: "blink 1s steps(2, start) infinite",
                }}
              >
                {displayedText}
                <span
                  className="blinking-cursor"
                  style={{
                    display: "inline-block",
                    width: "2px",
                    height: "18px",
                    backgroundColor: "rgb(137, 137, 137)", // Tailwind blue-600
                    marginLeft: "2px",
                    animation: "blink 1s step-start infinite",
                  }}
                ></span>
              </div>
              <br />
              <p style={{ letterSpacing: "1px" }}>
                Hello! I am Kunjal, currently pursuing my Master of Science in Computer Science at the University of
                California, Davis.
                My passion lies at the intersection of Full-Stack development and data-driven innovation. From building intuitive front-end experiences with React to crafting reliable backends in Java and Python, I enjoy turning ideas into impactful solutions. With a keen interest in Machine Learning and AI, I love exploring how data can unlock new possibilities and drive smarter decisions. Always curious, I'm excited by challenges that blend software craftsmanship with AI to create meaningful change. {/* shortened for brevity */}
              </p>
              <a
                href="https://drive.google.com/file/d/1DJHTc9nASNEVDVYSuBAMh_UcZGsgoBa1/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>


            </div>
          </div>
        </header>

        <div className="main_body" style={{ backgroundColor: "white", scrollBehavior: "smooth", marginTop: "10px" }}>
          <br /><br /><br /><br />

          <div className="education-title" id="education-title">
            <h2 style={{ color: "black" }}>EDUCATION</h2>
          </div><br /><br /><br /><br /><br />

          <div className="education">
            <div className="education-item">
              <div className="education-logo">
                <img src="/images/The_University_of_California_Davis.svg" alt="UC Davis logo"
                  style={{ width: "101px", height: "101px" }} />
              </div>
              <p><b>Master of Science in Computer Science</b><br />
                University of California, Davis | Sept 2024 - Jun 2026</p>
              <br />

              <p><b>Coursework</b> : Distributed Database Systems, Machine Learning and Discovery, Software Engineering, Advanced Topics in Vision - Language Research, Design and Analysis of Algorithms</p>
            </div>

            <div className="education-item">
              <div className="education-logo">
                <img src="/images/vit-logo.png" alt="VIT logo" />
              </div>
              <p><b>B.Tech in Information Technology</b><br />
                Vishwakarma Institute of Technology, Pune, India | Jul 2020 - May 2024</p>
              <br />

              <p><b>Coursework</b> : Software Design and Methodologies, Object-Oriented Programming, Artificial
                Intelligence,
                Data Science, Operating Systems, Database Management, System Programming, Web Technology</p>
            </div>
          </div>

          <br /><br /><br /><br /><br /><br /><br />

          <div className="domain-title">
            <h2>DOMAINS I WORK WITH</h2>
          </div><br />

          <div className="domain-container">
            <div className="domain-item">
              <img src="../images/full_stack.svg" alt="Full Stack Web Development" />
              <h3>Full Stack Web Development</h3>
            </div>

            <div className="domain-item">
              <img src="../images/analytics.svg" alt="Data Research and Analytics" />
              <h3>Data Research and Analytics</h3>
            </div>

            <div className="domain-item">
              <img src="../images/machine_learning.svg" alt="Machine Learning" />
              <h3>Machine Learning</h3>
            </div>
          </div>

          <br /><br /><br /><br />

          <div className="work-experience-title" id="work-experience-title">
            <h2 style={{ color: "black" }}>WORK EXPERIENCE</h2>
          </div>
          <br /><br />

          <div className="work-experience-timeline">
            {/* Cohesity Experience */}
            <div className="experience-container">
              <div className="experience-date">Jun 2025 - Sept 2025</div>
              <div className="experience-header">
                <h2>Software Engineer Intern</h2>
                <img src="../images/cohesity_logo.png" alt="Cohesity Logo" style={{ width: "auto", height: "20px" }} />
              </div>
              <h4 style={{paddingTop:"10px"}}>Cohesity</h4>
              <hr />
              <ul>
                <li>Designed and implemented an MCP server using <b>FastMCP</b>, integrating <b>Cohesity's RecoveryAgent</b> and <b>Anthropic Claude</b> to automate data recovery.</li>
                <li>Enabled natural language orchestration via Claude, allowing <b>AI agents</b> to perform recovery tasks, <b>increasing developer productivity</b> through AI-driven workflow automation.</li>
                <li>Ensured robust production deployment by adding advanced error handling, authentication, and observability, contributing to <b>99.99%</b> uptime and improved reliability.</li>
              </ul>
            </div>
            
            <br/><br/>

            {/* HSBC Experience */}
            <div className="experience-container">
              <div className="experience-date">Jul 2023 - Dec 2023</div>
              <div className="experience-header">
                <h2>Software Engineer Intern</h2>
                <img src="../images/hsbc2.webp" alt="HSBC Logo" style={{ width: "auto", height: "48px" }} />
              </div>
              <h4>HSBC Technology India</h4>
              <hr />
              <ul>
                <li>Worked on EzyOps (the flagship application of the MSS team) and developed a Car Pool system
                  for HSBC employees.</li>
                <li>Utilized Vert.x for API creation, Java for backend development, and React.js for frontend
                  implementation, improving user experience by <b>40%</b>.</li>
                <li>Collaborated with cross-functional agile teams to conceptualize, develop, and implement the
                  feature, delivering the project on time.</li>
              </ul>
            </div>

            <br /><br />

            {/*Research Assistant Experience*/}
            <div className="experience-container">
              <div className="experience-date">Jan 2023 - Aug 2023</div>
              <div className="experience-header">
                <h2>Research Assistant</h2>
                <img src="../images/vit-logo.png" alt="VIT Pune Logo" style={{ width: "auto", height: "55px" }} />
              </div>
              <h4>Vishwakarma Institute of Technology, Pune</h4>
              <hr />
              <ul>
                <li>Studied diverse clustering approaches and the impact of outliers on cluster formation.</li>
                <li>Developed two innovative methods for cluster creation, using visualizations like heatmaps
                  and scatter plots to address mixed clusters.</li>
                <li>Achieved <b>88%</b> accuracy on the Fisher Iris dataset.</li>
                <li>Presented findings at an international IEEE conference, highlighting the significance of our
                  work.</li>
              </ul>
            </div>
          </div>

          <br /><br /><br />

          <div className="project-title" id="project-title">
            <h2 style={{ color: "black" }}>PROJECTS</h2>
          </div><br /><br /><br />

          <div className="projects-container">
            <div className="project-card">
              <a href="https://github.com/cyn-crypto/ECS-260-Term-Project" target="_blank"
                rel="noopener noreferrer" style={{ textDecoration: "none" }}><img src="../images/forked_and_forgotten.jpg"
                  alt="Project 1" style={{ height: "300px" }} />
                <div className="project-content" style={{ paddingTop: "-2px" }}>
                  <p>Forked and Forgotten : The Uncertain Lifespan of Open Source Software Developers</p>
                  <ul style={{ justifyContent: "space-between" }}>
                    <li>Retrieved and processed contributor-level data using GitHub API; engineered key
                      metrics like retention period, activity level, and experience.</li>
                    <li>Conducted statistical analysis (correlation, t-tests, ANOVA test, Chi-Square test,
                      Mann-Whitney test) and built a logistic regression model, achieving high
                      classification accuracy in predicting contributor retention.</li>

                  </ul>
                </div>
              </a>
            </div>

            <div className="project-card">
              <a href="https://github.com/DevavratSinghBisht/ExpRes" target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: "none" }}><img src="../images/social_media.jpg" alt="Project 1"
                  style={{ height: "300px" }} />
                <div className="project-content" style={{ paddingTop: "-2px" }}>
                  <p>ExpRes: Decentralized Social Media Platform</p>
                  <ul style={{ justifyContent: "space-between" }}>
                    <li>Developed a decentralized social media platform using React.js, FastAPI, and
                      MongoDB, enabling real-time communication with 99% uptime via ResilientDB.</li>
                    <li>Engineered 8+ secure APIs for core features like message reporting.</li>
                    <li>Recognized as the outstanding project within the department for innovation and
                      execution.</li>

                  </ul>
                </div>
              </a>
            </div>

            <div className="project-card">
              <a href="https://github.com/kunjal2002/smart_bank" target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: "none" }}>
                <img src="../images/bank.jpg" alt="Project 2" style={{ height: "300px" }} />
                <div className="project-content">
                  <p>SmartBank: Automated Banking with Speech-to-text integration</p>
                  <ul style={{ justifyContent: "space-between" }}>
                    <li>Designed a full-stack banking system with PHP and MySQL, optimizing transactions and
                      user accessibility through intuitive UI/UX.</li>
                    <li>Integrated Web Speech API for voice-driven interactions, reducing wait times and
                      enhancing automation</li>
                  </ul>

                </div>
              </a>
            </div>

            <div className="project-card">
              <a href="https://github.com/kunjal2002/DMADM" target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: "none" }}>
                <img src="../images/proj_4.png" alt="Project 3" style={{ height: "300px" }} />
                <div className="project-content">
                  <p>MedEase : JAVA-based Hospital Management System</p>
                  <ul style={{ justifyContent: "space-between" }}>
                    <li>Developed a JAVA-based app with features like appointment scheduling, doctor
                      availability, and test booking, enhancing patient satisfaction and reducing
                      scheduling
                      time.</li>
                    <li>Integrated JavaFX for a responsive and user-friendly interface.</li>
                    <li>Optimized SQL queries for 1,000+ records, reducing query latency by 30%.</li>
                  </ul>
                </div>
              </a>
            </div>

            <div className="project-card">
              <a href="https://github.com/DevavratSinghBisht/AdaAct" target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: "none" }}>
                <img src="../images/adaact.jpg" alt="Project 4" style={{ height: "300px" }} />
                <div className="project-content">
                  <p>AdaAct: Adaptive Weighted Activation Functions for Neural Networks</p>
                  <ul style={{ justifyContent: "space-between" }}>
                    <li>Developed an activation function with data-driven weights, improving flexibility and
                      generalization, boosting accuracy by 5-18% on CIFAR-10 and CIFAR-100 respectively.
                    </li>
                    <li>Implemented sparsity regularization to reduce overfitting.</li>
                    <li>Acieved a 12% reduction and 98% accuracy on CIFAR-10 and 92% on CIFAR-100 with
                      ResNet18
                      and Vision Transformer models.</li>
                  </ul>
                </div>
              </a>
            </div>

            <div className="project-card">
              <a href="https://github.com/kunjal2002/authentication_system_using_facial_recognition_and_qr_code"
                target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <img src="../images/proj-1.png" alt="Project 5" style={{ height: "300px" }} />
                <div className="project-content">
                  <p>Authentication System Using Facial Recognition and QR Code</p>
                  <ul style={{ justifyContent: "space-between" }}>
                    <li>Developed a permission-based application using Pythonto prevent unauthorized access
                      to
                      important resources,
                      achieving 98% accuracy in user access control.</li>
                    <li> Leveraged image preprocessing techniquesto optimize processing efficiency by
                      40%.</li>
                  </ul>
                </div>
              </a>
            </div>

            <div className="project-card">
              <a href="https://github.com/kunjal2002/traffic_sign_ma"
                target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <img src="../images/proj-2.webp" alt="Project 5" style={{ height: "300px" }} />
                <div className="project-content">
                  <p>Traffic Sign Classification Using CNN</p>
                  <ul style={{ justifyContent: "space-between" }}>
                    <li>Developed a classification system using Convolutional Neural Networks (CNN) on the
                      GTSRB
                      dataset to identify traffic signs, handling 50,000+ images.</li>
                    <li>Pre-processed and augmented the input data, using OpenCV and TensorFlow, thereby
                      increased data variation by 40%, ultimately achieving 93% accuracy.</li>
                  </ul>
                </div>
              </a>
            </div>

            <div className="project-card">
              <a href="https://github.com/kunjal2002/conversion_of_ambiguous_grammar_to_unambiguous"
                target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <img src="../images/SP_CP.png" alt="Project    5" />
                <div className="project-content">
                  <p>Conversion of Ambiguous Grammar to Unambiguous Using Parse Tree</p>
                  <ul style={{ paddingTop: "20px" }}>
                    <li>Spearheaded the development of an ambiguity resolution system using Python, NLTK,
                      and
                      natural language processing.</li>
                    <li>Implemented tokenization, part-of-speech tagging, and dependency parsing to analyze
                      sentence structure and identify
                      potential sources of ambiguity with a 90% accuracy rate.</li>
                  </ul>
                </div>
              </a>
            </div>
          </div>

          <br /><br /><br /><br /><br />

          <div className="skills" id="skills">
            <div className="skills-title" style={{ textAlign: "center" }}>
              <h2 style={{ color: "black" }}><br />SKILLS<br /></h2>
            </div><br /><br />

            <div className="skills-ucd">
              <div className="languages">
                <h3>Languages</h3>
                <hr />
                <p style={{ fontSize: "13px", paddingTop: "5px" }}>JAVA, Python, PHP, TypeScript, JavaScript,
                  React.js, HTML, CSS</p>
              </div>

              <div className="databases">
                <h3>Databases and AI Agents</h3>
                <hr />
                <p style={{ fontSize: "13px", paddingTop: "5px" }}>MySQL, Oracle, Google Gemini, GitHub Copilot, Anthropic Claude, Windsurf</p>
              </div>

              <div className="tools">
                <h3>Tools</h3>
                <hr />
                <p style={{ fontSize: "13px", paddingTop: "5px" }}>JIRA, Confluence, MS Office Suite Apps, draw.io,
                  Jenkins, Visual Studio, Git, Docker, VS Code, IntelliJ IDEA, Jupyter Notebook</p>
              </div>

              <div className="other">
                <h3>Frameworks and Libraries</h3>
                <hr />
                <p style={{ fontSize: "13px", paddingTop: "5px" }}>JavaFX, JUnit, Vert.x, Apache Spark, TensorFlow,
                  PyTorch, Keras, OpenCV, FastAPI, FastMCP
                </p>
              </div>
            </div>
          </div><br /><br /><br /><br /><br />

          <div className="extracurriculars" id="extracurriculars">
            <div className="extracurriculars-title" id="extracurriculars-title">
              <h2 style={{ color: "black" }}>EXTRACURRICULAR ACTIVITIES</h2>
            </div><br /><br />

            <div className="extracurriculars-timeline">
              <div className="ex-container">
                <h2>Graduate Teaching Assistant, College of Engineering</h2>
                <h4>University of California, Davis</h4>
                <h5>Mar 2025 - Jun 2025</h5>
                <hr />
                <ul>
                  <li>Assisted in delivering course material, clarifying complex concepts during office hours
                    and discussion sessions.</li>
                  <li>Graded assignments, exams, and projects, ensuring fairness and timely feedback.</li>
                </ul>
              </div>

              <div className="ex-container">
                <h2>Graduate Student Assistant</h2>
                <h4>University of California, Davis</h4>
                <h5>Nov 2024 - Mar 2025</h5>
                <hr />
                <ul>
                  <li>Provided exceptional customer service in a fast-paced dining environment, enhancing
                    communication, time
                    management, and teamwork skills while balancing academic and extracurricular
                    commitments.</li>

                </ul>
              </div>

              <div className="ex-container">
                <h2>Student Representative, Board of Studies</h2>
                <h4>Vishwakarma Institute of Technology, Pune</h4>
                <h5>Jul 2023 - Jul 2024</h5>
                <hr />
                <ul>
                  <li>Represented students in academic meetings with department heads.</li>
                  <li>Contributed to curriculum updates for industry alignment.</li>
                  <li>Addressed academic concerns, improving the student experience.</li>
                </ul>
              </div>

              <div className="ex-container">
                <h2>LinkedIn Learning Ambassador</h2>
                <h4>LinkedIn</h4>
                <h5>Mar 2023 - May 2023</h5>
                <hr />
                <ul>
                  <li>Selected as one of the top 5 students from VIT Pune.</li>
                  <li>Collaborated with LinkedIn teams for community development.</li>
                  <li>Promoted LinkedIn Learning resources for students.</li>
                </ul>
              </div>

              <div className="ex-container">
                <h2>Treasurer</h2>
                <h4>Computer Society of India, VIT Pune</h4>
                <h5>Aug 2022 - Jun 2023</h5>
                <hr />
                <ul>
                  <li>Managed a database of 400+ members.</li>
                  <li>Oversaw a budget of ₹70,000 with precise tracking.</li>
                  <li>Organized 10+ events, including workshops & seminars.</li>
                </ul>
              </div>


              <div className="ex-container">
                <h2>Database Coordinator</h2>
                <h4>EPEC VIT, Pune</h4>
                <h5>Aug 2021 - Aug 2022</h5>
                <hr />
                <ul>
                  <li>Managed data for 4000+ event registrations.</li>
                  <li>Ensured accurate financial data tracking.</li>
                  <li>Guided volunteers for efficient event execution.</li>
                </ul>
              </div>

              <div className="ex-container">
                <h2>Student Volunteer</h2>
                <h4>VIT Social Welfare & Development</h4>
                <h5>Sept 2021</h5>
                <hr />
                <ul>
                  <li>Taught elders digital literacy skills.</li>
                  <li>Helped seniors use essential apps like Google Maps.</li>
                  <li>Contributed to community digital empowerment.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Include components like <Education />, <Projects />, <Experience />, <Skills />, etc. here */}

          <footer className="site-footer" id="site-footer">
            <div className="row">
              <div className="social-1">
                <a
                  href="mailto:kunjalagrawal2002@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/sending-mail.gif"
                    style={{ borderRadius: "100px", width: "55px", height: "55px" }}
                    alt="Email"
                  />
                </a>
              </div>

              <div className="social-2">
                <a
                  href="https://www.linkedin.com/in/kunjal-agrawal-8b5848206/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/linkedin.gif"
                    style={{ borderRadius: "2px", width: "50px", height: "50px" }}
                    alt="LinkedIn"
                  />
                </a>
              </div>

              <div className="social-3">
                <a
                  href="https://github.com/kunjal2002"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/github.gif"
                    style={{ borderRadius: "2px", width: "42px", height: "42px" }}
                    alt="GitHub"
                  />
                </a>
              </div>

              <div className="social-4">
                <a
                  href="https://www.instagram.com/agrawalkunjal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/images/instagram.gif"
                    style={{ borderRadius: "2px", width: "36px", height: "36px" }}
                    alt="Instagram"
                  />
                </a>
              </div>
            </div>
          </footer>

          <div className="copyright-message">
            <p
              id="footer-message"
              style={{ color: "black", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "-10px" }}
            >
              <b>© Made with ❤️ by Kunjal Agrawal</b>
            </p>
          </div>

          <br></br><br></br>


        </div>
        {AnalyticsComp ? <AnalyticsComp /> : null}
      </div>
    </ClickSpark>
  );
};

export default App;
