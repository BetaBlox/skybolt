import { modelDisplayName } from "@/config/admin";
import { DMMF } from "database";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetch("/api/models", {
      method: "GET",
    })
      .then((res) => res.json())
      .then(setModels);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {models.map((m: DMMF.Model) => (
        <div>
          <Link to={`/models/${m.name.toLowerCase()}`}>
            {modelDisplayName(m.name)}
          </Link>
        </div>
      ))}
    </div>
  );
}
