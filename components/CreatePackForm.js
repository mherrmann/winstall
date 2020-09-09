import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/create.module.scss";
import Link from "next/link";

const CreatePackForm = ({ user, packApps, editMode, defaultValues, isDisabled }) => {
    const { handleSubmit, register, errors } = useForm({ defaultValues });
    const [creating, setCreating] = useState(false);
    const [created, setCreated] = useState();
    const [error, setError] = useState("");
    const router = useRouter();

    const onSubmit = (values) => {
        setCreating(true);

        const apps = packApps.map(app => {
          return {
            _id: app._id,
            name: app.name,
            icon: app.icon
          }
        })

        var myHeaders = new Headers();
        myHeaders.append("Authorization", `${user.accessToken},${user.refreshToken}`);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("title", values.title);
        urlencoded.append("desc", values.description);
        urlencoded.append("apps", JSON.stringify(apps));
        urlencoded.append("creator", user.id);
        urlencoded.append("accent", values.accent);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://api.winstall.app/packs/create", requestOptions)
            .then(async (response) => {
                if(response.status !== 200){
                    const res = await response.json();
                    setCreating(false);
                    setError(res.error);
                    return;
                }

                return response.json()
            })
            .then(result => {
                localStorage.removeItem("ownPacks");
                router.push(`/packs/${result._id}`)
                setCreated(result)
            })
            .catch(error => {
                setCreating(false);
                setError(error.message);
            });
    };

    if(created){
        return (
        <p>Your pack "{created.title}" has been sucesfully {editMode ? "updated" : "created"}! You can view it here: <Link href="/packs/[id]" as={`/packs/${created._id}`}><a>winstall.app/packs/{created._id}</a></Link></p>
        )
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.createForm}>
        <label>
          Pack title
          <input
            name="title"
            type="text"
            placeholder="Give your pack a name"
            ref={register({
              required: true,
              validate: (value) => { return value.replace(/\s/g, '').length === 0 ? false : true; }
            })}
            autoComplete="off"
          />
          {errors.title && <span className={styles.formError}>Please check the name of your pack!</span>}
        </label>

        <label>
          Pack description
          <input
            name="description"
            type="text"
            ref={register({
                required: true,
                validate: (value) => { return value.replace(/\s/g, '').length === 0 ? false : true; }
            })}
            placeholder="Give your pack a short description"
            autoComplete="off"
          />
          {errors.description && <span className={styles.formError}>Please check the description of your pack!</span>}
        </label>

        <label>
          Pack accent
          
          <div className={styles.accents}>
            <label htmlFor="winterNeva"><input defaultChecked={true} type="radio" id="winterNeva" name="accent" value="winterNeva" ref={register({ required: true })} /><p>Winter Neva</p></label>
            <label htmlFor="deepBlue"><input type="radio" id="deepBlue" name="accent" value="deepBlue" ref={register({ required: true })} /><p>Deep Blue</p></label>
            <label htmlFor="starWine"><input type="radio" id="starWine" name="accent" value="starWine" ref={register({ required: true })} /><p>Star Wine</p></label>
            <label htmlFor="purpleDivision"><input type="radio" id="purpleDivision" name="accent" value="purpleDivision" ref={register({ required: true })} /><p>Purple Divison</p></label>
            <label htmlFor="loveKiss"><input type="radio" id="loveKiss" name="accent" value="loveKiss" ref={register({ required: true })} /><p>Love Kiss</p></label>
          </div>

          {errors.accent && <span className={styles.formError}>Please check the accent of your pack!</span>}
        </label>
        <button type="submit" className="button" disabled={creating || created || isDisabled}>
          {creating ? (editMode ? "Updating..." : "Creating...") : (editMode ? "Update Pack" : "Create pack")}
        </button>

        {error && <p>Couldn't {editMode ? "update" : "add"} pack! Error: {error}</p>}
      </form>
    );
}

export default CreatePackForm;