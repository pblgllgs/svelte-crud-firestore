<script>
    import {
        collection,
        addDoc,
        onSnapshot,
        deleteDoc,
        doc,
    } from 'firebase/firestore';
    import { onDestroy } from 'svelte';
    import { db } from './firebase';
    import Swal from 'sweetalert2';

    let task = {
        title: '',
        description: '',
    };
    let tasks = [];

    const handleSubmit = async () => {
        //addDoc para que firebase le agregue id automaticamente
        try {
            await addDoc(collection(db, 'tasks'), task);
            Swal.fire('Success', 'Tarea agregada con exito', 'success');
        } catch (error) {
            Swal.fire('Error', error, 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'tasks', id));
            Swal.fire('Success', 'Task eliminada con exito', 'success');
        } catch (error) {
            Swal.fire('Error', error, 'error');
        }
    };

    //se queda subscrito a los nuevos cambios que se ejecutan en la base de datos
    const unSubscribe = onSnapshot(
        collection(db, 'tasks'),
        (querySnapshot) => {
            tasks = querySnapshot.docs.map((doc) => {
                return { ...doc.data(), id: doc.id };
            });
            console.log(tasks);
        },
        (err) => {
            console.log(err);
        }
    );
    onDestroy(unSubscribe);
</script>

<main>
    <form on:submit|preventDefault={handleSubmit}>
        <label for="title">Title</label>
        <input bind:value={task.title} type="text" placeholder="Write a text" />

        <label for="description">Description</label>
        <textarea
            bind:value={task.description}
            id="description"
            cols="30"
            rows="10"
            placeholder="White a description"
        />
        <button type="submit"> Enviar </button>
    </form>

    {#each tasks as task}
        <div>
            <h5>{task.title}</h5>
            <p>{task.description}</p>
            <button on:click={handleDelete(task.id)}>Delete</button>
            <button>Edit</button>
        </div>
    {/each}
</main>

<style>
</style>
