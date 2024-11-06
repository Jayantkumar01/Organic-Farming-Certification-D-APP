// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract newContract {
    struct Certification {
        uint256 id;
        string farmName;
        address farmAddress;
        uint256 expiryDate;
        bool isCertified;
    }

    struct ComplianceRecord {
        uint256 certificationId;
        string complianceData;
        uint256 timestamp;
    }

    uint256 public certificationCount = 0;
    uint256 public complianceCount = 0;
    mapping(uint256 => Certification) public certifications;
    mapping(uint256 => ComplianceRecord[]) public complianceRecords;

    event CertificationCreated(uint256 id, string farmName, address farmAddress, uint256 expiryDate);
    event ComplianceAdded(uint256 certificationId, string complianceData);

    function createCertification(string memory _farmName, address _farmAddress, uint256 _expiryDate) public {
        certificationCount++;
        certifications[certificationCount] = Certification(certificationCount, _farmName, _farmAddress, _expiryDate, true);
        emit CertificationCreated(certificationCount, _farmName, _farmAddress, _expiryDate);
    }

    function addCompliance(uint256 _certificationId, string memory _complianceData) public {
        require(certifications[_certificationId].isCertified, "Certification not found or expired");
        complianceRecords[_certificationId].push(ComplianceRecord(_certificationId, _complianceData, block.timestamp));
        emit ComplianceAdded(_certificationId, _complianceData);
    }

    function getCertification(uint256 _certificationId) public view returns (Certification memory) {
        return certifications[_certificationId];
    }

    function getComplianceRecords(uint256 _certificationId) public view returns (ComplianceRecord[] memory) {
        return complianceRecords[_certificationId];
    }
}
