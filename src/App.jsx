import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";

const CONTRACT_ADDRESS = "0x7218078453f475a246ab67664bfeac6fc96ca311";
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_certificationId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_complianceData",
				"type": "string"
			}
		],
		"name": "addCompliance",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "farmName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "farmAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expiryDate",
				"type": "uint256"
			}
		],
		"name": "CertificationCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "certificationId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "complianceData",
				"type": "string"
			}
		],
		"name": "ComplianceAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_farmName",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_farmAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_expiryDate",
				"type": "uint256"
			}
		],
		"name": "createCertification",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "certificationCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "certifications",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "farmName",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "farmAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "expiryDate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isCertified",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "complianceCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "complianceRecords",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "certificationId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "complianceData",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_certificationId",
				"type": "uint256"
			}
		],
		"name": "getCertification",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "farmName",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "farmAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "expiryDate",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCertified",
						"type": "bool"
					}
				],
				"internalType": "struct newContract.Certification",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_certificationId",
				"type": "uint256"
			}
		],
		"name": "getComplianceRecords",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "certificationId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "complianceData",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct newContract.ComplianceRecord[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [farmName, setFarmName] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [certificationId, setCertificationId] = useState("");
  const [complianceData, setComplianceData] = useState("");

  const [certifications, setCertifications] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [complianceRecords, setComplianceRecords] = useState([]);

  useEffect(() => {
    async function loadProvider() {
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = tempProvider.getSigner();
      const tempContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, tempSigner);
      
      setProvider(tempProvider);
      setSigner(tempSigner);
      setContract(tempContract);
    }
    loadProvider();
  }, []);

  const createCertification = async () => {
    if (!farmName || !farmAddress || !expiryDate) {
      alert("Please fill all fields.");
      return;
    }

    const tx = await contract.createCertification(farmName, farmAddress, expiryDate);
    await tx.wait();
    alert("Certification created!");
  };

  const fetchCertification = async (id) => {
    try {
      const cert = await contract.getCertification(id);
      setSelectedCertification(cert);
      fetchComplianceRecords(id);
    } catch (error) {
      console.error("Certification not found.");
    }
  };

  const fetchComplianceRecords = async (id) => {
    const records = await contract.getComplianceRecords(id);
    setComplianceRecords(records);
  };

  const addComplianceRecord = async () => {
    if (!certificationId || !complianceData) {
      alert("Please enter a certification ID and compliance data.");
      return;
    }

    const tx = await contract.addCompliance(certificationId, complianceData);
    await tx.wait();
    alert("Compliance record added!");
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Organic Certification DApp</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Create Certification</h2>
        <input
          className="p-2 border rounded w-full mb-2"
          type="text"
          placeholder="Farm Name"
          value={farmName}
          onChange={(e) => setFarmName(e.target.value)}
        />
        <input
          className="p-2 border rounded w-full mb-2"
          type="text"
          placeholder="Farm Address (Ethereum Address)"
          value={farmAddress}
          onChange={(e) => setFarmAddress(e.target.value)}
        />
        <input
          className="p-2 border rounded w-full mb-4"
          type="number"
          placeholder="Expiry Date (Timestamp)"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded"
          onClick={createCertification}
        >
          Create Certification
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Fetch Certification</h2>
        <input
          className="p-2 border rounded w-full mb-4"
          type="number"
          placeholder="Certification ID"
          onChange={(e) => setCertificationId(e.target.value)}
        />
        <button
          className="w-full p-2 bg-green-500 text-white rounded mb-4"
          onClick={() => fetchCertification(certificationId)}
        >
          Fetch Certification
        </button>
        {selectedCertification && (
          <div>
            <h3 className="text-lg font-semibold">Certification Details:</h3>
            <p><strong>Farm Name:</strong> {selectedCertification.farmName}</p>
            <p><strong>Farm Address:</strong> {selectedCertification.farmAddress}</p>
            <p><strong>Expiry Date:</strong> {new Date(selectedCertification.expiryDate * 1000).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add Compliance Record</h2>
        <input
          className="p-2 border rounded w-full mb-2"
          type="number"
          placeholder="Certification ID"
          value={certificationId}
          onChange={(e) => setCertificationId(e.target.value)}
        />
        <input
          className="p-2 border rounded w-full mb-4"
          type="text"
          placeholder="Compliance Data"
          value={complianceData}
          onChange={(e) => setComplianceData(e.target.value)}
        />
        <button
          className="w-full p-2 bg-purple-500 text-white rounded"
          onClick={addComplianceRecord}
        >
          Add Compliance
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">Compliance Records</h2>
        {complianceRecords.length > 0 ? (
          complianceRecords.map((record, index) => (
            <div key={index} className="border-b py-2">
              <p><strong>Data:</strong> {record.complianceData}</p>
              <p><strong>Date:</strong> {new Date(record.timestamp * 1000).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No compliance records available for this certification.</p>
        )}
      </div>
    </div>
  );
}

export default App;
