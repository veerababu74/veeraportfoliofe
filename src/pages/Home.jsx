import { useState, useEffect } from 'react';
import { profileAPI, contentAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Education from '../components/Education';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function Home() {
  const [profile, setProfile] = useState(null);
  const [about, setAbout] = useState(null);
  const [settings, setSettings] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        profileRes,
        aboutRes,
        settingsRes,
        skillsRes,
        experienceRes,
        educationRes,
        projectsRes,
        certsRes,
      ] = await Promise.all([
        profileAPI.get(),
        profileAPI.getAbout(),
        profileAPI.getSettings(),
        contentAPI.getSkills(),
        contentAPI.getExperience(),
        contentAPI.getEducation(),
        contentAPI.getProjects(),
        contentAPI.getCertifications(),
      ]);

      setProfile(profileRes.data);
      setAbout(aboutRes.data);
      setSettings(settingsRes.data);
      setSkills(skillsRes.data);
      setExperience(experienceRes.data);
      setEducation(educationRes.data);
      setProjects(projectsRes.data);
      setCertifications(certsRes.data);

      // Update page title
      if (settingsRes.data?.site_title) {
        document.title = settingsRes.data.site_title;
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: 16,
      }}>
        <div className="animate-pulse-glow" style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
        }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar profile={profile} />
      <Hero profile={profile} />
      <About about={about} profile={profile} />
      <Skills skills={skills} />
      <Experience experience={experience} />
      <Projects projects={projects} />
      <Education education={education} certifications={certifications} />
      <Contact profile={profile} />
      <Footer profile={profile} settings={settings} />
    </>
  );
}

export default Home;
