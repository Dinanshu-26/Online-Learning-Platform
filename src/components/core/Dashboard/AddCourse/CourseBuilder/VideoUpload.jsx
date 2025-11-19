import React, { useState, useEffect } from "react";

export default function VideoUpload({
    name,
    label,
    register,
    errors,
    setValue,
    viewData,
    editData
}) {
    const [videoPreview, setVideoPreview] = useState(null);

    const handleOnChange = (e) => {
        const file = e.target.files[0];
        setValue(name, file);

        if (file) {
            const videoURL = URL.createObjectURL(file);
            setVideoPreview(videoURL);
        }
    };

    useEffect(() => {
        if (viewData) setVideoPreview(viewData);
        if (editData) setVideoPreview(editData);
    }, []);

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5">
                {label} <sup className="text-pink-200">*</sup>
            </label>

            {videoPreview ? (
                <div>
                    <video
                        src={videoPreview}
                        controls
                        className="w-full rounded-md"
                    ></video>

                    <button
                        type="button"
                        onClick={() => {
                            setVideoPreview(null);
                            setValue(name, null);
                        }}
                        className="text-sm text-richblack-5 mt-2"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <input
                    type="file"
                    accept="video/*"
                    {...register(name, { required: true })}
                    onChange={handleOnChange}
                    className="text-richblack-5"
                />
            )}

            {errors[name] && (
                <span className="text-xs text-pink-200">
                    Video is required
                </span>
            )}
        </div>
    );
}
