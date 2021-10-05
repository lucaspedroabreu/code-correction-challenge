const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(newRepository)

  return response.status(201).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const routeParams = request.params;
  const { title, url, techs } = request.body;

  const repositoryToBeUpdatedIndex = repositories.findIndex(repository => repository.id === routeParams.id)

  if (repositoryToBeUpdatedIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories[repositoryToBeUpdatedIndex] = { ...repositories[repositoryToBeUpdatedIndex], title, url, techs }

  return response.json(repositories[repositoryToBeUpdatedIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryToBeDeletedIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryToBeDeletedIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryToBeDeletedIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const likedRepository = repositories.find(repository => repository.id === id);

  if (!likedRepository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const newLikesCount = likedRepository.likes + 1
  likedRepository.likes = newLikesCount

  return response.json(likedRepository);
});

module.exports = app;
