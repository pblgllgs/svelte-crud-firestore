<script>
    import {
        collection,
        addDoc,
        onSnapshot,
        deleteDoc,
        doc,
        getDoc,
        updateDoc,
    } from 'firebase/firestore';
    import { onDestroy } from 'svelte';
    import { db } from './firebase';
    import Swal from 'sweetalert2';
    import Toastify from 'toastify-js';

    let task = {
        title: '',
        description: '',
    };
    let tasks = [];

    let edit = false;
    let currentId = '';

    const addTask = async () => {
        try {
            if (task.title === '' || task.description === '') {
                Swal.fire('Error', 'Campos incompletos', 'error');
                return;
            }
            await addDoc(collection(db, 'tasks'),{
                ...task,createAt: new Date()
            });
            // Swal.fire('Success', 'Tarea agregada con exito', 'success');
            Toastify({
                text: 'Tarea creada',
                duration: 1500,
                newWindow: true,
                close: true,
                gravity: 'top', // `top` or `bottom`
                position: 'right', // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: '#6b7ff3',
                },
                // onClick: function () {}, // Callback after click
            }).showToast();
        } catch (error) {
            Swal.fire('Error', error, 'error');
        }
    };

    const updateTask = async () => {
        try {
            await updateDoc(doc(db, 'tasks', currentId), task);
            Swal.fire('Success', 'Datos actualizados', 'success');
        } catch (error) {
            Swal.fire('Error', error, 'error');
        }
    };

    const handleEdit = async (currentTask) => {
        try {
            task.title = currentTask.title;
            task.description = currentTask.description;
            edit = true;
            currentId = currentTask.id;
        } catch (error) {
            Swal.fire('Error', error, 'error');
        }
    };

    const handleSubmit = async () => {
        //addDoc para que firebase le agregue id automaticamente
        try {
            if (edit) {
                updateTask();
            } else {
                addTask();
            }
        } catch (error) {
            Swal.fire('Error', error, 'error');
        }

        task = {
            title: '',
            description: '',
        };
        edit = false;
        currentId = '';
    };

    const handleDelete = async (id) => {
        try {
            Swal.fire({
                title: `Borrar task ${id}?`,
                text: 'Tu no podrás revertir esta acción!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminalo!',
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteDoc(doc(db, 'tasks', id));
                    console.log('aca');
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    );
                }
            });
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
        },
        (err) => {
            console.log(err);
        }
    );
    onDestroy(unSubscribe);
</script>

<main>
    <div class="container p-4">
        <div class="row">
            <div class="col-md-6">
                <form
                    on:submit|preventDefault={handleSubmit}
                    class="card card-body p-5"
                >
                    <div class="mb-3">
                        <label for="title" class="text-secondary fs-5"
                            >Title</label
                        >
                        <input
                            bind:value={task.title}
                            type="text"
                            placeholder="Write a text"
                            class="form-control"
                        />
                    </div>

                    <div class="mb-3">
                        <label for="description" class="text-secondary fs-5"
                            >Description</label
                        >
                        <textarea
                            bind:value={task.description}
                            id="description"
                            cols="30"
                            rows="10"
                            placeholder="White a description"
                            class="form-control"
                        />
                    </div>

                    <div>
                        <button type="submit" class="btn btn-primary">
                            <i
                                class="material-icons"
                                style="vertical-align: middle;">save</i
                            > Guardar
                        </button>
                    </div>
                </form>
            </div>
            <div class="col-md-6">
                {#each tasks as task}
                    <div class="card card-body mt-2">
                        <div class="d-flex justify-content-between">
                            <h5>{task.title}</h5>
                            <i
                                class="material-icons cursor"
                                on:click={handleEdit(task)}>edit</i
                            >
                        </div>
                        <p>{task.description}</p>
                        <div>
                            <button
                                class="btn btn-danger"
                                on:click={handleDelete(task.id)}
                            >
                                <i
                                    class="material-icons"
                                    style="vertical-align: middle;"
                                    >delete_forever</i
                                >Delete
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</main>

<style>
</style>
