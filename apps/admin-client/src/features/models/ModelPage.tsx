import Breadcrumbs from "@/components/Breadcrumbs";
import { createUrl, editUrl, modelDisplayName, showUrl } from "@/config/admin";
import { DMMF } from "database";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { captilalize } from "utils";
import {
  AdminAttributeType,
  renderFieldInCollectionView,
} from "../../../../admin-api/src/config/admin";

export default function ModelPage() {
  const { modelName } = useParams();
  const [data, setData] = useState<{
    prismaModelConfig: DMMF.Model;
    attributeTypes: AdminAttributeType[];
    collectionAttributes: string[];
    showAttributes: string[];
    formAttributes: string[];
    count: number;
    // Ignoring for now because we don't have a type for this API payload
    records: any[]; // eslint-disable-line
  }>();

  useEffect(() => {
    fetch(`/api/models/${modelName}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data || !modelName) return null;

  const {
    // attributeTypes,
    collectionAttributes,
    // showAttributes,
    // formAttributes,
    records,
    count,
  } = data;

  return (
    <div>
      <Breadcrumbs
        links={[
          { href: "/admin", text: "Admin" },
          { text: modelDisplayName(modelName) },
        ]}
      />
      <div className="flex flex-row items-center justify-between">
        <h1 className="mb-4 text-3xl font-bold">
          {modelDisplayName(modelName)} ({count})
        </h1>
        <Link
          to={createUrl(modelName)}
          className="rounded bg-green-600 px-3 py-2 font-medium text-white"
        >
          Add New
        </Link>
      </div>
      <div className="relative overflow-x-auto bg-white shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-50">
          <thead className="bg-gray-100 text-xs text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Id
              </th>
              {collectionAttributes.map((attribute) => (
                <th
                  scope="col"
                  key={attribute}
                  className="whitespace-nowrap px-6 py-3"
                >
                  {captilalize(attribute)}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 text-gray-900">{record.id}</td>
                {collectionAttributes.map((attribute) => (
                  <td
                    key={attribute}
                    className="whitespace-nowrap px-6 py-4 text-gray-900"
                  >
                    {renderFieldInCollectionView(record, modelName, attribute)}
                  </td>
                ))}
                <td className="flex flex-row gap-2 px-6 py-4 text-gray-900">
                  <Link
                    to={showUrl(modelName, record)}
                    className="rounded px-3 py-2 font-medium text-slate-500 hover:bg-slate-500 hover:text-white"
                  >
                    Show
                  </Link>
                  <Link
                    to={editUrl(modelName, record)}
                    className="rounded px-3 py-2 font-medium text-indigo-500 hover:bg-indigo-500 hover:text-white"
                  >
                    Edit
                  </Link>
                  {/* <DeleteButton modelName={modelName} record={record} /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
