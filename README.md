
# Real-Time Taxi HotMap Display

This project enables real-time visualization of taxi pickups and drop-offs using a heatmap in the frontend. It leverages Change Data Capture (CDC) to generate and persist real-time taxi data, and utilizes MongoDB with CDC, Google's Pub/Sub, BigQuery, and Google Cloud Platform (GCP) for data storage, streaming, analysis, and hosting.

## Table of Contents


- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Real-Time Taxi HotMap project provides a real-time heatmap visualization of taxi pickups and drop-offs. It utilizes Change Data Capture (CDC) to capture and process real-time taxi data. CDC captures data changes from the source (e.g., a MongoDB database) and streams them to downstream systems for further processing and analysis. In this project, CDC captures changes stream from MongoDB and streams them to Google's Pub/Sub. The data is then loaded into BigQuery for efficient data aggregation and analysis, enabling the creation of a real-time heatmap based on the latest taxi data. The backend and frontend components are hosted on Google Cloud Platform (GCP).

## Features

- **Real-Time Data Generation**: Simulate and generate real-time taxi data for pickups and drop-offs.
- **Heatmap Visualization**: Display the taxi pickups and drop-offs on a heatmap that dynamically updates based on real-time data changes.
- **Storage Optimization**: Automatically remove old data from MongoDB to manage storage limitations imposed by the free tier.
- **Reliable Data Streaming**: Utilize Google's Pub/Sub as a reliable and scalable message broker for streaming MongoDB change streams.
- **Efficient Data Analysis**: Leverage BigQuery for data aggregation and analysis, enabling insights into taxi patterns and trends.
- **Change Data Capture (CDC)s**: Utilize MongoDB's CDC feature to capture and stream real-time taxi data changes.
  
## Getting Started

To get started with the Real-Time Taxi HotMap locally, follow these steps:

1. Clone the backend repository: `git clone [<repository-url>](https://github.com/anne-creator/realtime-hotmap-backend.git)`
2. Clone the front repository: `git clone [<repository-url>](https://github.com/RuiWang98/realtime-hotmap-frontend.git)`
3. Clone the pipeline repository: `git clone [<repository-url>](https://github.com/TYL1026/mongoDB-pubsub-pipline.git)` 
4. Install the necessary dependencies: `npm install`
5. Configure the environment variables according to your setup.
6. Start the pipeline application to connect MongoDB with Pub/Sub
7. Start the backend application to fetch data from MongoDB and Pub/Sub.
8. Start the frontend application to display the real-time heatmap.

For detailed instructions and configuration options, refer to the [Installation Guide](./docs/installation.md).

To get started with the Real-Time Taxi HotMap online, please visit : [FrontEnd Website](https://realtime-hotmap-frontend-dqij5lkaea-uc.a.run.app )
## Architecture

The Real-Time Taxi HotMap project follows a microservice-based architecture, leveraging MongoDB, Google's Pub/Sub, and BigQuery. The components involved are as follows:

- **Data Simulator**: Generates and simulates real-time taxi data for pickups and drop-offs.
- **MongoDB**: Persists the real-time taxi data, automatically removing old data when storage thresholds are reached.
- **Google Pub/Sub**: Streams MongoDB change streams, ensuring reliable and scalable message delivery.
- **BigQuery**: Stores the taxi data for efficient aggregation and analysis, enabling the creation of real-time heatmaps.
- **Frontend**: Displays the real-time heatmap, visualizing taxi pickups and drop-offs on a web-based interface.

For a more detailed understanding of the architecture and the interaction between components, please refer to the [Architecture Guide](./docs/architecture.md).
![T-Trainee drawio](https://github.com/anne-creator/realtime-hotmap-backend/assets/65515982/af50f390-2261-4ba7-b2e6-2410d090d308)

## Technologies

The Real-Time Taxi HotMap project utilizes the following technologies:

- **MongoDB**: A document database for storing and persisting real-time taxi data.
- **Google Pub/Sub**: A reliable and scalable message broker for streaming MongoDB change streams.
- **BigQuery**: A fully managed, serverless data warehouse for efficient data analysis and visualization.
- **Frontend Framework**: A web-based framework (React) for building the real-time heatmap interface.
- **Data Simulator**: A script for generating and simulating real-time taxi data.

For a comprehensive list of dependencies and libraries used, please refer to the project's documentation.



## License

