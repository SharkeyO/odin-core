import React from 'react'

export const <%= name %> = ({ children }) => (
  <div className="<%= h.changeCase.paramCase(name) %>">{children}</div>"
)