// @flow strict

import { skillsData } from "@/utils/data/skills";
import Marquee from "react-fast-marquee";

function Skills() {
  return (
    <div
      id="skills"
      className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]"
    >
      <div className="w-[100px] h-[100px] bg-violet-100 rounded-full absolute top-6 left-[42%] translate-x-1/2 filter blur-3xl  opacity-20"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent  w-full" />
        </div>
      </div>

      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex  items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md">
            Skills
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="w-full my-12">
        <Marquee
          gradient={false}
          speed={80}
          pauseOnHover={true}
          pauseOnClick={true}
          delay={0}
          play={true}
          direction="left"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {skillsData.map((skill, index) => (
              <div
                key={index}
                className="p-3 bg-[#11152c] border border-[#1f223c] rounded-lg shadow-md hover:border-violet-500 transition-all"
              >
                <a href={skill.url} target="_blank" rel="noreferrer">
                  <img
                    src={skill.logo}
                    alt={skill.name}
                    className="h-10 w-auto mx-auto"
                  />
                </a>
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
}

export default Skills;
