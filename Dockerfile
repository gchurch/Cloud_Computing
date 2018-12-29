# Use an official Node runtime as a parent image
FROM node:8

# Set the working directory to /app
WORKDIR /app

# Copy the files from  the myapp directory into the container at /app
COPY /myapp /app

# Install any needed packages specified in package.json
RUN npm install

# Make port 3000 available to the world outside the container
EXPOSE 3000

# Set the DEBUG environment variable
ENV DEBUG=myapp:*

# Run the app when the container launches
CMD ["npm", "start"]