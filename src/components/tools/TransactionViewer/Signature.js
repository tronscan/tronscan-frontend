import React from "react";
import Field from "./Field";

export default function Signature({signature}) {

  return (
      <table className="table">
        <Field label="Signature">{signature.bytes}</Field>
      </table>
  );
}
