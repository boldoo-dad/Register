import React, { useState, useEffect } from "react";

const defaultImageSrc = "img/Profile_avatar_placeholder_large.png";

const initialFieldValues = {
  id: 0,
  name: "",
  description: "",
  image: "",
  imageSrc: defaultImageSrc,
  imageFile: null,
};

export default function Employee(props) {
  const { addOrEdit, recordForEdit } = props;
  const [values, setValues] = useState(initialFieldValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (recordForEdit != null) setValues(recordForEdit);
  }, [recordForEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValues({
          ...values,
          imageFile,
          imageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setValues({
        ...values,
        imageFile: null,
        imageSrc: defaultImageSrc,
      });
    }
  };

  const validate = () => {
    let temp = {};
    temp.name = values.name == "" ? false : true;
    temp.imageSrc = values.imageSrc == defaultImageSrc ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x == true);
  };

  const resetForm = () => {
    setValues(initialFieldValues);
    document.getElementById("image-uploader").value = null;
    setErrors({});
  };

  const handleFormSubmit = (e) => {
    if (validate()) {
      const formData = new FormData();
      formData.append("id", values.id);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("image", values.image);
      formData.append("imageFile", values.imageFile);
      addOrEdit(formData, resetForm);
    } else {
      e.preventDefault();
    }
  };

  const applyErrorClass = (field) =>
    field in errors && errors[field] == false ? "invalid-field" : "";

  return (
    <>
      <div>
        <p className="lead">An Employee</p>
      </div>
      <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
        <div className="card">
          <img src={values.imageSrc} className="card-img-top" />
          <div className="card-body">
            <div className="form-group">
              <input
                type="file"
                accept="image/*"
                className={"form-control-file " + applyErrorClass("imageSrc")}
                onChange={showPreview}
                style={{ widht: 100 }}
                id="image-uploader"
              />
            </div>
            <div className="form-group">
              <input
                className={"form-control-file " + applyErrorClass("name")}
                placeholder="Employee Name"
                name="name"
                value={values.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Occupation"
                name="description"
                value={values.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-light">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
