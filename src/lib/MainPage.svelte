<script>
  import { getAuth, signOut } from "firebase/auth";
  import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
  } from "firebase/firestore";
  import { user } from "../stores/svetleStore";
  import { auth, db } from "./firebase";
  import TodoItem from "./TodoItem.svelte";

  let addTodoText;
  let currentUser;
  user.subscribe((val) => (currentUser = val));
  let isLoadingComplete;
  async function logOut() {
    await signOut(auth);
  }

  let currentTodoList = [];

  async function loadTodoList() {
    isLoadingComplete = false;
    try {
      console.log("Loading Todo List");
      const todoListQuery = query(
        collection(db, "todos"),
        where("userID", "==", currentUser.uid)
      );
      // TODO: Doo the rest from here
      onSnapshot(todoListQuery, async function (snapshot) {
        snapshot.docChanges().forEach((change) => {
          const tempTodo = {
            todoText: change.doc.data().todoText,
            id: change.doc.id,
            timestamp: change.doc.data().timestamp,
            userID: change.doc.data().userID,
            isCompleted: change.doc.data().isCompleted,
          };
          if (change.type == "added") {
            currentTodoList = [...currentTodoList, tempTodo];
          }
          if (change.type == "removed") {
            currentTodoList = currentTodoList.filter(
              (e) => e.id != tempTodo.id
            );
            console.log("Removed");
          }
        });
        isLoadingComplete = true;
      });
    } catch (error) {
      console.log(error);
    }
  }
  loadTodoList();

  async function addTodo() {
    if (addTodoText) {
      try {
        await addDoc(collection(db, "todos"), {
          todoText: addTodoText,
          userID: currentUser.uid,
          isCompleted: false,
          timestamp: serverTimestamp(),
        });
        addTodoText = "";
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Enter TODO text!");
    }
  }
</script>

<h1>Hello! {currentUser.displayName}</h1>

{#if isLoadingComplete}
  {#if currentTodoList[0]}
    <h1>Todos!</h1>
    <ul>
      {#each currentTodoList as todoItem}
        <TodoItem
          isCompleted={todoItem.isCompleted}
          todoID={todoItem.id}
          todoText={todoItem.todoText}
        />
      {/each}
    </ul>
  {:else}
    <h2>Try Adding Todo's!</h2>
  {/if}
{:else}
  <div class="loader">Loading...</div>
{/if}

<div>
  <input bind:value={addTodoText} type="text" placeholder="todo work" />
  <button on:click={addTodo}>🕊️</button>
</div>

<button on:click={logOut}>Sign Out</button>

<style>
  input {
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
  }
  .loader {
    color: #ffffff;
    font-size: 90px;
    text-indent: -9999em;
    overflow: hidden;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    margin: 72px auto;
    position: relative;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load6 1.7s infinite ease, round 1.7s infinite ease;
    animation: load6 1.7s infinite ease, round 1.7s infinite ease;
  }
  @-webkit-keyframes load6 {
    0% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em,
        -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em,
        -0.297em -0.775em 0 -0.477em;
    }
    20% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
        -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em,
        -0.749em -0.34em 0 -0.477em;
    }
    38% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
        -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em,
        -0.82em -0.09em 0 -0.477em;
    }
    100% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
  }
  @keyframes load6 {
    0% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em,
        -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em,
        -0.297em -0.775em 0 -0.477em;
    }
    20% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em,
        -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em,
        -0.749em -0.34em 0 -0.477em;
    }
    38% {
      box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em,
        -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em,
        -0.82em -0.09em 0 -0.477em;
    }
    100% {
      box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em,
        0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
  }
  @-webkit-keyframes round {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes round {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
