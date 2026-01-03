import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import Banner from "../Banner";

const defaultImg = "/bg.jpg";

const MemberCard = ({
  name,
  school,
  img = defaultImg,
  instagram,
  linkedin,
  role,
}) => {
  return (
    <motion.div
      className="relative flex flex-col items-center p-4 rounded-xl shadow-md transition hover:shadow-xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="w-full aspect-[2/3] overflow-hidden rounded-md border border-gray-200 mb-2 bg-white flex items-center justify-center">
        <img
          src={img}
          alt={name}
          className="h-full object-contain object-center"
        />
      </div>
      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1 text-center">
        {name}
        {role && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full
              ${role === "leader"
                ? "bg-purple-100 text-purple-600"
                : role === "co-leader"
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
              }`}
          >
            {role}
          </span>
        )}
      </p>
      <p
        className={
          school === "Korean Minjok Leadership Academy, Korea"
            ? "text-[10px] text-gray-500"
            : "text-xs text-gray-500"
        }
      >
        {school}
      </p>
    </motion.div>
  );
};

const TeamSection = ({ title, members }) => (
  <div className="mb-16 text-left">
    <h3 className="text-2xl font-extrabold text-blue-700 mb-6">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {members.map((member, index) => (
        <MemberCard
          key={member.id || index}
          {...member}
        />
      ))}
    </div>
  </div>
);

const Members = () => {
  const [membersByTeam, setMembersByTeam] = useState({});

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members`);
        const grouped = {};
        res.data.forEach((member) => {
          const team = member.team || "Others";
          if (!grouped[team]) grouped[team] = [];
          grouped[team].push({
            id: member.id,
            name: member.name,
            role: member.role,
            school: member.school,
            description: member.description,
            instagram: member.instagram,
            linkedin: member.linkedin,
            img: member.picture || defaultImg,
          });
        });
        setMembersByTeam(grouped);
      } catch (err) {
        console.error("❌ Failed to fetch members:", err);
      }
    };
    fetchMembers();
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-white to-blue-50 text-gray-800">
      <Banner
        title="Meet Our Team"
        subtitle="Get to know the passionate members behind SarangXanh’s projects and initiatives."
        buttonText="Explore Members"
        onButtonClick={() =>
          document.getElementById("teams")?.scrollIntoView({ behavior: "smooth" })
        }
      />

      <div className="max-w-6xl mx-auto px-6 py-20" id="teams">
        {Object.entries(membersByTeam).map(([teamName, members], idx) => (
          <TeamSection key={idx} title={teamName} members={members} />
        ))}
      </div>
    </section>
  );
};

export default Members;
