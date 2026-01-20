import React, { useEffect, useRef, useState } from "react";
import { Save, Trash2, Plus, Loader2 } from "lucide-react";
import { supabase } from "../../../../lib/supabase";

const roles = ["leader", "co-leader", "member"];
const teams = ["content", "website", "marketing", "media"];

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingMemberId, setUploadingMemberId] = useState(null); // image upload state
  const [newMemberInputs, setNewMemberInputs] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [addingTeam, setAddingTeam] = useState(null); // loading state for adding
  const fileInputs = useRef({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("name", { ascending: true });
    if (error) {
      console.error("Failed to load members:", error);
      setMembers([]);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;
    const filePath = `members/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("public-media")
      .upload(filePath, file);
    if (uploadError) {
      console.error("Failed to upload image:", uploadError);
      return "";
    }

    const { data } = supabase.storage
      .from("public-media")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleAdd = async (team) => {
    const inputs = newMemberInputs[team] || {};
    if (!inputs.name) {
      alert("⚠️ Please fill in at least name.");
      return;
    }

    setAddingTeam(team);

    const key = `new-${team}`;
    let pictureUrl = "";
    if (imageFiles[key]) {
      pictureUrl = await uploadImage(imageFiles[key]);
    }

    const newMember = {
      name: inputs.name,
      role: inputs.role || "member",
      school: inputs.school || "",
      description: inputs.description || "",
      team,
      picture_url: pictureUrl,
    };

    const { error } = await supabase.from("members").insert([newMember]);
    if (error) {
      console.error("Failed to add member:", error);
    }
    await fetchMembers();

    setNewMemberInputs((prev) => ({ ...prev, [team]: {} }));
    setImageFiles((prev) => ({ ...prev, [key]: null }));
    setAddingTeam(null);
  };

  const handleUpdate = async (member) => {
    const { error } = await supabase
      .from("members")
      .update({
        name: member.name,
        role: member.role,
        school: member.school,
        description: member.description,
        team: member.team,
        picture_url: member.picture_url,
      })
      .eq("id", member.id);
    if (error) {
      console.error("Failed to update member:", error);
      return;
    }
    alert("✅ Member updated!");
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete member:", error);
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFieldChange = (id, field, value) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleNewInputChange = (team, field, value) => {
    setNewMemberInputs((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        [field]: value,
      },
    }));
  };

  const getTeamMembers = (team) => {
    const byTeam = members.filter(
      (member) => member.team?.toLowerCase() === team.toLowerCase()
    );
    return byTeam.slice().sort((a, b) => {
      const aRank = a.role === "leader" ? 0 : 1;
      const bRank = b.role === "leader" ? 0 : 1;
      if (aRank !== bRank) return aRank - bRank;
      return (a.name || "").localeCompare(b.name || "");
    });
  };

  const handlePictureClick = (id) => {
    if (fileInputs.current[id]) {
      fileInputs.current[id].click();
    }
  };

  const handleExistingImageChange = async (e, member) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingMemberId(member.id);
    const imageUrl = await uploadImage(file);
    const updatedMember = { ...member, picture_url: imageUrl };
    await handleUpdate(updatedMember);
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? updatedMember : m))
    );
    setUploadingMemberId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800">👥 Team Members Editor</h1>

      {teams.map((team) => {
        const teamMembers = getTeamMembers(team);

        return (
          <div
            key={team}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {team} Team
            </h2>

            {teamMembers.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No members yet.</p>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="grid md:grid-cols-6 gap-4 items-center border-b border-gray-200 pb-4"
                >
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      handleFieldChange(member.id, "name", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg"
                    placeholder="Name"
                  />
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleFieldChange(member.id, "role", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={member.school}
                    onChange={(e) =>
                      handleFieldChange(member.id, "school", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg"
                    placeholder="School"
                  />
                  <input
                    type="text"
                    value={member.description}
                    onChange={(e) =>
                      handleFieldChange(member.id, "description", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg"
                    placeholder="Description"
                  />
                  <div className="relative">
                    <img
                      src={member.picture_url || "/bg.jpg"}
                      alt="pic"
                      className={`w-12 h-12 rounded-full object-cover border cursor-pointer ${
                        uploadingMemberId === member.id ? "opacity-50" : ""
                      }`}
                      onClick={() => handlePictureClick(member.id)}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileInputs.current[member.id] = el)}
                      onChange={(e) => handleExistingImageChange(e, member)}
                      className="hidden"
                    />
                    {uploadingMemberId === member.id && (
                      <Loader2 className="absolute top-0 left-0 w-12 h-12 animate-spin text-gray-500" />
                    )}
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleUpdate(member)}
                      className="bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                    >
                      <Save className="w-4 h-4 inline" /> Save
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      <Trash2 className="w-5 h-5 inline" /> Remove
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Add new member */}
            <div className="grid md:grid-cols-6 gap-4 items-center pt-4 border-t border-gray-200">
              <input
                type="text"
                placeholder="Name"
                value={newMemberInputs[team]?.name || ""}
                onChange={(e) =>
                  handleNewInputChange(team, "name", e.target.value)
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
              <select
                value={newMemberInputs[team]?.role || "member"}
                onChange={(e) =>
                  handleNewInputChange(team, "role", e.target.value)
                }
                className="p-2 border border-gray-300 rounded-lg"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="School"
                value={newMemberInputs[team]?.school || ""}
                onChange={(e) =>
                  handleNewInputChange(team, "school", e.target.value)
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Description"
                value={newMemberInputs[team]?.description || ""}
                onChange={(e) =>
                  handleNewInputChange(team, "description", e.target.value)
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="file"
                onChange={(e) =>
                  setImageFiles((prev) => ({
                    ...prev,
                    [`new-${team}`]: e.target.files[0],
                  }))
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => handleAdd(team)}
                disabled={addingTeam === team}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  addingTeam === team
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {addingTeam === team ? (
                  <Loader2 className="w-4 h-4 animate-spin inline" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 inline" /> Add
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MembersPage;
