# doc-gen

This app is made for auto generating boilerplate Google docs files.

This app is not a hot fresh app for end user, just a neat script that does it's job.

### Prerequisites:

1. Have a google account
2. Create a google cloud project
3. Add Google Drive and Google Docs API's to it
4. Follow this
   [guide](https://developers.google.com/docs/api/quickstart/nodejs) up to the
   _Install the client library_ step (you don't need to do anything with coding
   this project covers all for you)
5. Create folder `secrets` and copy `credentials.json` you've created on step 4.

### The workflow:

- Create a task.json file anywhere in your system
- Populate it with the following schema:

```json
{
  "config": {
    "template": "id", // id of a template file
    "directory": "id", // id of a directory where files will be populated
    "caseSensitive": true, // global default for case sensitivity requirements (default false)
    "dryRun": false // set to true if you want just to see what will be happening
  },
  "task": {
    // root task
    "name": "Root", // name of root task
    "replacements": [
      {
        "from": "YEAR", // what text
        "to": "2025" // replace with what
      },
      {
        "from": "AUTHOR",
        "to": "David Telen'ko"
      }
    ],
    "subtasks": [
      // child tasks that follows same structure
      {
        "name": "Child1", // name of the task
        "replacements": [
          {
            "from": "CLIENT", // what text
            "to": "Template User" // replace with what
          }
        ]
      },
      {
        "name": "Child2", // name of the task
        "replacements": [
          {
            "from": "CLIENT", // what text
            "to": "Template User 2" // replace with what
          }
        ]
      }
    ]
  }
}
```

> Note: for each subtask with no children a file with substitutions will be created. For subtask with children the directory with this name will be created. The example below will yield the following structure:

    Root
    ├──Child1.gdoc
    └──Child2.gdoc

- Run

```bash
bun run start -- ./path/to/task.json
```

- Wait until script finishes, and check your Google Drive.
- If any error occurs refer to [Prerequisites](###Prerequisites) mostly steps 3
  and 4.
- Most errors regarding your `task.json` file will be caught, unless you did
  something out of this world.

### Notes

If any questions occurs please refer to [source code](./src).
