import React from "react";
import * as Spinners from "react-spinners";

const DEFAULT_COLOR = "#343a40";

export function BarLoader({ width = 60, ...props} = {}) {
    return (
        <Spinners.BarLoader color={DEFAULT_COLOR} loading={true} height={5} width={width} {...props} />
    )
}

export function PropagateLoader(props = {}) {
    return (
        <Spinners.PropagateLoader color={DEFAULT_COLOR} size={20} {...props} />
    )
}

export function TronLoader({options = {}, children = null, height = 70, ...props}) {

    return (
        <div className="p-3 text-center">
            <img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBiYWNrZ3JvdW5kOiBub25lOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiPgo8cmVjdCB4PSIxNSIgeT0iMzAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2UxNWI2NCI+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGNhbGNNb2RlPSJzcGxpbmUiIGtleVRpbWVzPSIwOzAuNTsxIiBrZXlTcGxpbmVzPSIwLjUgMCAwLjUgMTswLjUgMCAwLjUgMSIgdmFsdWVzPSIxOzAuMjsxIiBiZWdpbj0iLTAuNiI+PC9hbmltYXRlPgo8L3JlY3Q+PHJlY3QgeD0iMzUiIHk9IjMwIiB3aWR0aD0iMTAiIGhlaWdodD0iNDAiIGZpbGw9IiNkZDkxOGYiPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBjYWxjTW9kZT0ic3BsaW5lIiBrZXlUaW1lcz0iMDswLjU7MSIga2V5U3BsaW5lcz0iMC41IDAgMC41IDE7MC41IDAgMC41IDEiIHZhbHVlcz0iMTswLjI7MSIgYmVnaW49Ii0wLjQiPjwvYW5pbWF0ZT4KPC9yZWN0PjxyZWN0IHg9IjU1IiB5PSIzMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZWRjOGM2Ij4KICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgY2FsY01vZGU9InNwbGluZSIga2V5VGltZXM9IjA7MC41OzEiIGtleVNwbGluZXM9IjAuNSAwIDAuNSAxOzAuNSAwIDAuNSAxIiB2YWx1ZXM9IjE7MC4yOzEiIGJlZ2luPSItMC4yIj48L2FuaW1hdGU+CjwvcmVjdD48cmVjdCB4PSI3NSIgeT0iMzAiIHdpZHRoPSIxMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2Y5ZWNlYyI+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGNhbGNNb2RlPSJzcGxpbmUiIGtleVRpbWVzPSIwOzAuNTsxIiBrZXlTcGxpbmVzPSIwLjUgMCAwLjUgMTswLjUgMCAwLjUgMSIgdmFsdWVzPSIxOzAuMjsxIiBiZWdpbj0iLTEiPjwvYW5pbWF0ZT4KPC9yZWN0Pgo8IS0tIFtsZGlvXSBnZW5lcmF0ZWQgYnkgaHR0cHM6Ly9sb2FkaW5nLmlvLyAtLT48L3N2Zz4="
                style={{height}}/>
            {
                children && <div className="pt-3">
                    {children}
                </div>
            }

        </div>
    );
}
