import React from "react";
import Field from "./Field";

export default function Signature({signature}) {

  return (
      <table className="table">
        <tbody>
            <Field label="Signature">{signature.bytes}</Field>
        </tbody>
      </table>
  );
}
