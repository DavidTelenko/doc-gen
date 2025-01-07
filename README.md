# doc-gen

This app is made for auto generating boilerplate Google docs files.

This app is not a hot fresh app for end user, just a neat script that does it's job.

### General Idea:

This project uses Google docs and Google drive API's to achieve the following
idea:

Let's say we have a group of people and we want to generate a CV template for
each of them. In order to manually do this we need to create several potential
duplicates of the same document with mostly same template that differs only in
name of the CV owner, his knowledge, experience and other stuff.

What we can do instead is to use prepared template and describe all needed
information in plain text using json (or any other markup language, then
transform it to json). Then using simple unique keyword-like terms in our
template replace them with terms from json schema.

### Example

In this particular example simplified content of a template document will look
something like this:

```
NAME_SURNAME's CV
    QUOTE

Soft skills:
    SOFT_SKILLS

Hard skills:
    HARD_SKILLS

YEAR
```

`json` schema would look like this:

```json
{
  "task": {
    "name": "CV's",
    "replacements": [
      {
        "from": "YEAR",
        "to": "2025"
      }
    ],
    "subtasks": [
      {
        "name": "David Telenko",
        "replacements": [
          {
            "from": "NAME_SURNAME",
            "to": "David Telen'ko"
          },
          {
            "from": "QUOTE",
            "to": "I love programming!"
          },
          {
            "from": "SOFT_SKILLS",
            "to": "Non conflicting"
          },
          {
            "from": "HARD_SKILLS",
            "to": "TS, C++, JS, Go, Lua, Neovim"
          }
        ]
      }
    ]
  }
}
```

In the end, substituted document then would look like this:

```
David Telen'ko's CV
    I love programming!

Soft skills:
    Non conflicting

Hard skills:
    TS, C++, JS, Go, Lua, Neovim

2025
```

You can imagine that the template document can be way more detailed and
modifying everything by hand for many people will quickly turn to nightmare.

### Managing directory structure

Managing directory structure with manual approach will also be extremely hard,
and eventually all of your workspace may end up in some temp or downloads
directory on your computer.

This is another problem that this app aims to solve. By creating a directory
for each intermediate parent task we can achieve simple declarative interface
through the API. The above example will create a directory named `CV's` and
place every CV in a document with the same name as a name of a participant.

### Prerequisites:

To use this app you need to follow this steps and prerequisites to start.

1. Have a google account
2. Have a [node](https://nodejs.org/en) runtime installed on your machine.
3. [Create a google cloud project](https://developers.google.com/workspace/guides/create-project)
4. Add Google Drive and Google Docs API's to it
5. Follow this
   [guide](https://developers.google.com/docs/api/quickstart/nodejs) up to the
   _Install the client library_ step (you don't need to do anything with coding
   this project covers all for you)
6. Create folder `secrets` and copy `credentials.json` you've created on step 4.

### The workflow:

- Create a task.json file anywhere in your system
- Populate it with the following schema:

```jsonc
{
  "config": {
    "template": "id", // id of a template file
    "directory": "id", // id of a directory where files will be populated
    "caseSensitive": true, // global default for case sensitivity requirements (default false)
    "dryRun": false, // set to true if you want just to see what will be happening
  },
  "task": {
    // root task
    "name": "Root", // name of root task
    "replacements": [
      {
        "from": "YEAR", // what text
        "to": "2025", // replace with what
      },
      {
        "from": "AUTHOR",
        "to": "David Telen'ko",
      },
    ],
    "subtasks": [
      // child tasks that follows same structure
      {
        "name": "Child1", // name of the task
        "permissions": [
          // list of permissions for the file or directory
          {
            "email": "some_email@gmail.com", // valid gmail email
            "role": "writer", // writer, reader, commenter
          },
        ],
        "replacements": [
          {
            "from": "CLIENT", // what text
            "to": "Template User", // replace with what
          },
        ],
      },
      {
        "name": "Child2", // name of the task
        "replacements": [
          {
            "from": "CLIENT", // what text
            "to": "Template User 2", // replace with what
          },
        ],
      },
    ],
  },
}
```

> [!IMPORTANT]
> For each subtask with no children a file with substitutions will be created.
> For subtask with children the directory with this name will be created. The
> example above will yield the following structure:

    Root
    ├──Child1.gdoc
    └──Child2.gdoc

- Install dependencies and run

```bash
npm i
npm start -- ./path/to/task.json
```

> [!NOTE]
> Any other runtime is sufficient

- You will be prompted to login into your account.
- Wait until script finishes, and check your Google Drive.
- If any error occurs refer to [Prerequisites](###Prerequisites) mostly steps 3
  and 4.
- Most errors regarding your `task.json` file will be caught, unless you did
  something out of this world.
- If for some reason you want to remove cached auth token, delete
  `secrets/token.json` from root of this project

### Notes

If any questions occurs please refer to [source code](./src). PR-s are welcome.
