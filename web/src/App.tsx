import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import { useRef, useState } from "react";

import './App.css'
import discordIcon from '/assets/icons/discord_icon.png'
import telegramIcon from '/assets/icons/telegram_icon.png'
import twitterIcon from '/assets/icons/twitter_icon.jpg'

const pageTransition = (delay: number = 0) => {return {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: {duration: 0.3, delay: delay} },
  exit: { opacity: 0, y: -20, transition: {duration: 0.1, delay: 0} }
}};

const projectData = [
  { id: 1, title: "Adastra", image: "/fvn-translation/assets/projects/adastra.png", banner_image: "/fvn-translation/assets/projects/adastra_banner.png",
    description: "이탈리아와 로마 제국에 관심이 많은 주인공은 이탈리아 로마로 교환학생을 오게 된다. 어느 밤, 갑자기 방에 나타난 늑대인간 형상에 의해 납치를 당하게 되고, 자신의 이름을 아미쿠스(Amicus)라고 소개한 그 늑대인간이 어처구니없게도 본인의 지위를 지키기 위해 자신을 반려동물로 데리고 가려는 목적임을 알게 된다. 다시 지구로 돌아갈 수도 없게 된 주인공은 결국 지구로 돌아갈 수 있을 때까지만 아미쿠스의 반려동물 행세를 하기로 하는데...",
    originalLink: "https://echoproject.itch.io/adastra",
    status: "완료",
  },
  { id: 2, title: "Interea", image: "/fvn-translation/assets/projects/interea.webp", banner_image: "/fvn-translation/assets/projects/interea_banner.png",
    description: "인테레아는 아다스트라의 미드퀄입니다.\n아다스트라의 황제 아미쿠스와 그의 동반자 주인공의 사이드 에피소드들을 담고 있습니다.",
    originalLink: "https://echoproject.itch.io/interea",
    status: "완료(0.4버전)",
  },
  { id: 3, title: "Khemia", image: "/fvn-translation/assets/projects/khemia.png", banner_image: "/fvn-translation/assets/projects/khemia_banner.png",
    description: "케미아는 아다스트라의 시퀄입니다.\n멘헤라? 주인공 스키피오와 능글능글한 네페루의 케미를 감상해봐요.",
    originalLink: "https://echoproject.itch.io/khemia",
    status: "완료(0.1버전)",
  },
  { id: 4, title: "The Smoke Room", image: "/fvn-translation/assets/projects/tsr.png", banner_image: "/fvn-translation/assets/projects/tsr_banner.png",
    description: "배경은 전작 Echo에서 약 100년전.\n남창 사무엘 아이어스는 더 나은 삶을 추구하려다 오히려 좋지 않은 결과로 이어진다.",
    originalLink: "https://thegoodnightfellowship.itch.io/the-smoke-room",
    status: "닉 루트 50% 완료",
  },
  { id: 5, title: "Arches", image: "/fvn-translation/assets/projects/arches.png", banner_image: "/fvn-translation/assets/projects/arches_banner.png",
    description: "In March 2020, boyfriends Cameron and Devon arrive in the ghost town of Echo to conduct a paranormal investigation. It has been five years since the mass hysteria supposedly left the town completely abandoned. While it does seem empty at first, they realize that something evil still lurks in Echo, evil enough that it has kept the horrors alive. ",
    originalLink: "https://echoproject.itch.io/arches",
    status: "50% 완료",
  },
  { id: 6, title: "Echo", image: "/fvn-translation/assets/projects/echo.png", banner_image: "/fvn-translation/assets/projects/echo_banner.png",
    description: "Echo is a horror visual novel about a small, isolated, desert town located somewhere in the southwestern states.",
    originalLink: "https://echoproject.itch.io/echo",
    status: "AI번역 진행중",
  },
  { id: 7, title: "Remember the Flowers", image: "/fvn-translation/assets/projects/rtf.gif", banner_image: "/fvn-translation/assets/projects/rtf_banner.png",
    description: "This story follows the tale of an amnesiac man.\nWith memories fleeting,  he wakes up in what seems to be a new world.\nThe only thing he's certain of is his desire to return home.\nThe only question is: what has become of it?",
    originalLink: "https://jerichowo.itch.io/remember-the-flowers",
    status: "AI번역 진행중",
  },
  { id: 8, title: "Burrows", image: "/fvn-translation/assets/projects/burrows.png", banner_image: "/fvn-translation/assets/projects/burrows_banner.png",
    description: "After leaving behind his former life in 1920's New Orleans, a jaded possum named Grey finds himself thrown into an unending nightmare by the enigmatic bartender, Virgil.  Lost in a churning sea of souls, Grey comes across a group of men somehow connected to his former home, a plantation replete with it's own dark history.  Just as quickly as they find each other they're suddenly taken away, leaving Grey only one option:\nDig a little deeper.",
    originalLink: "https://nikkonator5000.itch.io/burrows",
    status: "AI번역 진행중",
  },
];

type Project = typeof projectData[number]

const teamMemberData = [
  { id: 1, name: "도루룽", image: "/fvn-translation/assets/members/dorurung.png", description: "아다스트라를 너무 감명 깊게 플레이해서 시작한 번역 프로젝트인데.. 스케일이 끝도없이 커지고 있다!", job: "프로그래머", discord: "Dorurung#6690", telegram: "@dorurung"},
  { id: 2, name: "Husky", image: "/fvn-translation/assets/members/husky.jpg", description: "", job: "번역가"},
  { id: 3, name: "늑발", image: "/fvn-translation/assets/members/nukbal.jpg", description: "", job: "프로그래머", twitter: "https://x.com/frostwolfclaw"},
  { id: 4, name: "Nelson", image: "/fvn-translation/assets/members/nelson.png", description: "", job: "번역가", twitter: "https://x.com/ultim8nelson"},
  { id: 5, name: "레드벨", image: "/fvn-translation/assets/members/redbell.png", description: "", job: "번역가"}
]

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
  const projectRef = useRef<HTMLDivElement | null>(null)

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setTimeout(() => {
      projectRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePrevNext = (direction: number) => {
    if (!selectedProject) return;
    const currentIndex = projectData.findIndex(p => p.id === selectedProject.id);
    const newIndex = (currentIndex + direction + projectData.length) % projectData.length;
    handleSelectProject(projectData[newIndex]);
  };

  return (
    <motion.div className="p-4 text-center" {...pageTransition()}>
      <h2 className="text-xl font-bold">진행 중인 프로젝트</h2>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {projectData.filter((project) => !!project).map((project, index) => (
          <motion.button
            key={project.id}
            className="border p-2 rounded-md bg-white shadow-md hover:bg-gray-200"
            onClick={() => handleSelectProject(project)}
            {...pageTransition(0.3 + (index+1) * 0.2)}
          >
            <img src={project.banner_image} alt={project.title} className="place-self-center object-contain rounded-md justify-center" />
            {/* <p className="text-sm mt-2">{project.title}</p> */}
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {selectedProject && (
          <motion.div 
            ref={projectRef}
            key={selectedProject.id}
            className="mt-4 p-4 border rounded-md bg-white shadow-md whitespace-pre-line"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, transition: {duration: 0.3} }}
            exit={{ opacity: 0, scale: 0.9, transition: {duration: 0.1} }}
          >
            <div className="flex justify-center">
              <button 
                className="bg-gray-200 p-2 rounded-full m-4 hover:bg-gray-400"
                onClick={() => handlePrevNext(-1)}
              >
                ◀
              </button>
              <h3 className="text-lg font-bold m-4 self-center">{selectedProject.title}</h3>
              <button 
                className="bg-gray-200 p-2 rounded-full m-4 hover:bg-gray-400"
                onClick={() => handlePrevNext(1)}
              >
                ▶
              </button>
            </div>
            <motion.img 
              src={selectedProject.image} 
              alt={selectedProject.title} 
              className="w-full object-cover rounded-md mt-2 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.3 } }}
              exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            />
            <motion.p 
              className="mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 1 } }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
            >
              {selectedProject.description}
              <br/>
              <br/>
              <a href={selectedProject.originalLink} className="underline font-bold">원작 링크</a>
              <br/>
              <br/>
              한국어화 진행도: <b>{selectedProject.status}</b>
            </motion.p>
            <div className="flex justify-center">
              <button 
                className="bg-gray-200 p-2 rounded-full m-4 hover:bg-gray-400"
                onClick={() => handlePrevNext(-1)}
              >
                ◀
              </button>
              <h3 className="text-lg font-bold m-4 self-center">{selectedProject.title}</h3>
              <button 
                className="bg-gray-200 p-2 rounded-full m-4 hover:bg-gray-400"
                onClick={() => handlePrevNext(1)}
              >
                ▶
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Team = () => (
  <>
  <motion.div className="p-4 text-center" {...pageTransition()}>
    <h2 className="text-xl font-bold">우리는...</h2>
    <p className="mt-2">퍼리 비주얼 노벨을 너무나 사랑해서 한국어로 번역하고 싶어하는 사람들입니다.</p>
  </motion.div>
  <motion.div className="p-4 text-center" {...pageTransition(0.5)}>
    <h2 className="text-xl font-bold">커뮤니티</h2>
    <p className="mt-2">디스코드 서버에서 최신 배포와 소식을 알아보세요.</p>
    <br />
    <a href='https://discord.gg/U7XsRUc83T' className="flex items-center justify-center">
      <img src={discordIcon} className="w-32 h-32"></img>
    </a>
  </motion.div>
  <motion.div className="p-4 text-left" {...pageTransition(1.0)}>
    <h2 className="text-xl text-center font-bold">팀원 소개</h2>
    {teamMemberData.map((member, index) => (
      <>
      <motion.div className="flex items-left p-4 bg-white shadow-md rounded-lg mt-4" {...pageTransition(1.0 + (index+1) * 0.2)}>
        <img
          src={member.image}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="ml-4">
          <h2 className="text-lg font-semibold">{member.name}</h2>
          <p className="text-sm text-gray-600">{member.job}</p>
          <br/>
          <p className="text-sm text-gray-600">{member.description}</p>
          <div className="flex gap-4 mt-4">
            {member.discord && (
              <div className="flex items-center">
                <img src={discordIcon} className="w-8 h-8" />
                <p className="text-sm text-gray-600 ml-2">{member.discord}</p>
              </div>
            )}
            {member.telegram && (
              <div className="flex items-center">
                <img src={telegramIcon} className="w-8 h-8" />
                <p className="text-sm text-gray-600 ml-2">{member.telegram}</p>
              </div>
            )}
            {member.twitter && (
              <div className="flex items-center ml-2">
                <a href={member.twitter}>
                  <img src={twitterIcon} className="w-8 h-8" />
                </a>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      </>
    ))}
  </motion.div>
  </>
);

const Layout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="max-w-3xl w-full">
        <nav className="bg-white shadow-md flex justify-around">
          <Link to="/fvn-translation" className="p-4 w-full text-center text-blue-500 hover:bg-gray-200">팀 소개</Link>
          <Link to="/fvn-translation/projects" className="p-4 w-full text-center text-blue-500 hover:bg-gray-200">프로젝트</Link>
        </nav>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/fvn-translation" element={<Team />} />
            <Route path="/fvn-translation/projects" element={<Projects />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
