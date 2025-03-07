import React, { useEffect, useState } from "react";
import axios from "axios";

const IpLocationComponent = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchIpLocations = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/ip-locations");
                setLocations(response.data.locations);
            } catch (error) {
                console.error("Error fetching IP locations:", error);
            }
        };

        fetchIpLocations();
    }, []);

    return (
        <div>
            <h2>User IP Addresses</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location, index) => (
                        <tr key={index}>
                            <td>{location.ipAddress}</td>
                            <td>{location.city}</td>
                            <td>{location.country}</td>
                            <td>{location.latitude}</td>
                            <td>{location.longitude}</td>
                            <td>{new Date(location.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default IpLocationComponent;
